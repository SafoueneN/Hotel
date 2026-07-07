const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema(
  {
    reservationId: {
      type: Number,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    montant: {
      type: Number,
      required: true,
      min: 0,
    },
    methode: {
      type: String,
      enum: ['CARTE', 'VIREMENT', 'ESPECES'],
      default: 'CARTE',
    },
    statut: {
      type: String,
      enum: ['EN_ATTENTE', 'REUSSI', 'ECHOUE'],
      default: 'EN_ATTENTE',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Paiement', paiementSchema);
