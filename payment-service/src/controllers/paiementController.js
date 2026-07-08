const Paiement = require('../models/Paiement');
const Notification = require('../models/Notification');
const runtimeConfig = require('../config/runtimeConfig');

function simulerTraitementPaiement() {
  return Math.random() < runtimeConfig.tauxSuccesSimulation ? 'REUSSI' : 'ECHOUE';
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

module.exports = {
  creerPaiement,
  getAllPaiements,
  getPaiementById,
  getPaiementsByReservation,
  updatePaiement,
  deletePaiement,
  getStatistiques,
};
