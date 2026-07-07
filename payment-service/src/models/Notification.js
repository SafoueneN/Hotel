const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    destinataire: {
      type: String,
      required: true,
    },
    sujet: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    reservationId: {
      type: Number,
    },
    envoyee: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
