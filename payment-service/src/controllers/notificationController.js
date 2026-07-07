const Notification = require('../models/Notification');

async function creerNotification(req, res, next) {
  try {
    const { destinataire, sujet, message, reservationId } = req.body;
    if (!destinataire || !sujet || !message) {
      return res.status(400).json({ message: 'destinataire, sujet et message sont requis' });
    }
    const notification = await Notification.create({ destinataire, sujet, message, reservationId });
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
}

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

async function updateNotification(req, res, next) {
  try {
    const { envoyee } = req.body;
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(envoyee !== undefined && { envoyee }) } },
      { new: true, runValidators: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification introuvable' });
    }
    res.json(notification);
  } catch (err) {
    next(err);
  }
}

async function deleteNotification(req, res, next) {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification introuvable' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  creerNotification,
  getAllNotifications,
  getNotificationsByDestinataire,
  updateNotification,
  deleteNotification,
};
