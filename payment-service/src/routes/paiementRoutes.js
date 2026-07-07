const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');

router.post('/', paiementController.creerPaiement);
router.get('/', paiementController.getAllPaiements);
router.get('/reservation/:reservationId', paiementController.getPaiementsByReservation);
router.get('/:id', paiementController.getPaiementById);

module.exports = router;
