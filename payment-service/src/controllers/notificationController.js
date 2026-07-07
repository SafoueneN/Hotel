const Notification = require('../models/Notification');

async function getAllNotifications(req, res, next) {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

async function getNotificationsByDestinataire(req, res, next) {
  try {
    const notifications = await Notification.find({ destinataire: req.params.email }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllNotifications,
  getNotificationsByDestinataire,
};
