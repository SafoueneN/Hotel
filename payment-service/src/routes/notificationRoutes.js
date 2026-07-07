const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getAllNotifications);
router.get('/:email', notificationController.getNotificationsByDestinataire);

module.exports = router;
