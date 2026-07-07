const Paiement = require('../models/Paiement');
const Notification = require('../models/Notification');

function simulerTraitementPaiement() {
  return Math.random() < 0.9 ? 'REUSSI' : 'ECHOUE';
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

module.exports = {
  creerPaiement,
  getAllPaiements,
  getPaiementById,
  getPaiementsByReservation,
};
