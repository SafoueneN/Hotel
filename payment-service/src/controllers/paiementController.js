const Paiement = require('../models/Paiement');
const Notification = require('../models/Notification');
const runtimeConfig = require('../config/runtimeConfig');
const { fetchReservation } = require('../config/reservationClient');
const { publierPaiementReussi, publierPaiementEchoue } = require('../config/rabbitmq');

function simulerTraitementPaiement() {
  return Math.random() < runtimeConfig.tauxSuccesSimulation ? 'REUSSI' : 'ECHOUE';
}

// Scenario de communication inter-microservices :
// 1) appel SYNCHRONE (REST) vers reservation-service pour recuperer les details de la reservation
// 2) si le paiement reussit, publication ASYNCHRONE (RabbitMQ) pour confirmer la reservation
async function payerReservation(req, res, next) {
  try {
    const { reservationId } = req.params;
    const { methode } = req.body;

    const reservation = await fetchReservation(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: `Réservation ${reservationId} introuvable` });
    }
    if (reservation.statut !== 'EN_ATTENTE') {
      return res.status(409).json({ message: `Réservation ${reservationId} déjà ${reservation.statut}` });
    }

    const statut = simulerTraitementPaiement();

    const paiement = await Paiement.create({
      reservationId,
      clientEmail: reservation.clientEmail,
      montant: reservation.montantTotal,
      methode: methode || 'CARTE',
      statut,
    });

    const notification = await Notification.create({
      destinataire: reservation.clientEmail,
      reservationId,
      sujet: statut === 'REUSSI' ? 'Paiement confirmé' : 'Échec du paiement',
      message:
        statut === 'REUSSI'
          ? `Votre paiement de ${reservation.montantTotal} DH pour la réservation #${reservationId} a été accepté. Votre réservation sera confirmée sous peu.`
          : `Le paiement de ${reservation.montantTotal} DH pour la réservation #${reservationId} a échoué. Veuillez réessayer.`,
      envoyee: true,
    });

    console.log(`[payment-service] Notification envoyée à ${reservation.clientEmail} : ${notification.sujet}`);

    if (statut === 'REUSSI') {
      publierPaiementReussi(Number(reservationId));
    } else {
      publierPaiementEchoue(Number(reservationId));
    }

    return res.status(201).json(paiement);
  } catch (err) {
    next(err);
  }
}

async function creerPaiement(req, res, next) {
  try {
    const { reservationId, clientEmail, montant, methode } = req.body;

    if (!reservationId || !clientEmail || montant === undefined) {
      return res.status(400).json({ message: 'reservationId, clientEmail et montant sont requis' });
    }

    const statut = simulerTraitementPaiement();

    const paiement = await Paiement.create({
      reservationId,
      clientEmail,
      montant,
      methode,
      statut,
    });

    const notification = await Notification.create({
      destinataire: clientEmail,
      reservationId,
      sujet: statut === 'REUSSI' ? 'Paiement confirmé' : 'Échec du paiement',
      message:
        statut === 'REUSSI'
          ? `Votre paiement de ${montant} DH pour la réservation #${reservationId} a été accepté.`
          : `Le paiement de ${montant} DH pour la réservation #${reservationId} a échoué. Veuillez réessayer.`,
      envoyee: true,
    });

    console.log(`[payment-service] Notification envoyée à ${clientEmail} : ${notification.sujet}`);

    return res.status(201).json(paiement);
  } catch (err) {
    next(err);
  }
}

async function getAllPaiements(req, res, next) {
  try {
    const paiements = await Paiement.find().sort({ createdAt: -1 });
    res.json(paiements);
  } catch (err) {
    next(err);
  }
}

async function getPaiementById(req, res, next) {
  try {
    const paiement = await Paiement.findById(req.params.id);
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement introuvable' });
    }
    res.json(paiement);
  } catch (err) {
    next(err);
  }
}

async function getPaiementsByReservation(req, res, next) {
  try {
    const paiements = await Paiement.find({ reservationId: req.params.reservationId });
    res.json(paiements);
  } catch (err) {
    next(err);
  }
}

async function updatePaiement(req, res, next) {
  try {
    const { statut, methode } = req.body;
    const paiement = await Paiement.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(statut && { statut }), ...(methode && { methode }) } },
      { new: true, runValidators: true }
    );
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement introuvable' });
    }
    res.json(paiement);
  } catch (err) {
    next(err);
  }
}

async function deletePaiement(req, res, next) {
  try {
    const paiement = await Paiement.findByIdAndDelete(req.params.id);
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement introuvable' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Fonctionnalité avancée : statistiques de paiements via pipeline d'agrégation MongoDB
async function getStatistiques(req, res, next) {
  try {
    const [parStatut, parMethode, global] = await Promise.all([
      Paiement.aggregate([
        { $group: { _id: '$statut', total: { $sum: '$montant' }, nombre: { $sum: 1 } } },
      ]),
      Paiement.aggregate([
        { $match: { statut: 'REUSSI' } },
        { $group: { _id: '$methode', total: { $sum: '$montant' }, nombre: { $sum: 1 } } },
      ]),
      Paiement.aggregate([
        { $match: { statut: 'REUSSI' } },
        {
          $group: {
            _id: null,
            totalEncaisse: { $sum: '$montant' },
            montantMoyen: { $avg: '$montant' },
            nombrePaiements: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      global: global[0] || { totalEncaisse: 0, montantMoyen: 0, nombrePaiements: 0 },
      parStatut,
      parMethode,
    });
  } catch (err) {
    next(err);
  }
}

// Reagit a l'evenement asynchrone 'reservation.annulee' publie par reservation-service :
// rembourse automatiquement le dernier paiement reussi de la reservation, s'il y en a un.
async function rembourserReservation(reservationId) {
  const paiementReussi = await Paiement.findOne({ reservationId, statut: 'REUSSI' }).sort({ createdAt: -1 });
  if (!paiementReussi) {
    console.log(`[payment-service] Aucun paiement reussi pour la reservation ${reservationId}, rien a rembourser`);
    return;
  }

  await Paiement.create({
    reservationId,
    clientEmail: paiementReussi.clientEmail,
    montant: paiementReussi.montant,
    methode: paiementReussi.methode,
    statut: 'REMBOURSE',
  });

  await Notification.create({
    destinataire: paiementReussi.clientEmail,
    reservationId,
    sujet: 'Remboursement effectué',
    message: `Votre paiement de ${paiementReussi.montant} DH pour la réservation #${reservationId} a été remboursé suite à l'annulation.`,
    envoyee: true,
  });

  console.log(`[payment-service] Remboursement créé pour la réservation ${reservationId}`);
}

module.exports = {
  creerPaiement,
  getAllPaiements,
  getPaiementById,
  getPaiementsByReservation,
  updatePaiement,
  deletePaiement,
  getStatistiques,
  payerReservation,
  rembourserReservation,
};
