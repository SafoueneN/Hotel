const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');

router.post('/', paiementController.creerPaiement);
router.get('/', paiementController.getAllPaiements);
router.get('/stats', paiementController.getStatistiques);
router.get('/reservation/:reservationId', paiementController.getPaiementsByReservation);
router.post('/reservation/:reservationId/payer', paiementController.payerReservation);
router.get('/:id', paiementController.getPaiementById);
router.put('/:id', paiementController.updatePaiement);
router.delete('/:id', paiementController.deletePaiement);

module.exports = router;
