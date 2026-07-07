const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/', notificationController.creerNotification);
router.get('/', notificationController.getAllNotifications);
router.get('/:email', notificationController.getNotificationsByDestinataire);
router.put('/id/:id', notificationController.updateNotification);
router.delete('/id/:id', notificationController.deleteNotification);

module.exports = router;
