const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');

// Create a new payment
router.post('/create', paymentController.create);

// Get all payments
router.get('/getall', paymentController.getAll);

// Get a payment by its ID
router.get('/:id', paymentController.getById);

// Get payments by service provider ID
router.get('/service-provider/:id_service_provider', paymentController.getByServiceProvider);

// Update a payment by its ID
router.put('/:id', paymentController.update);

// Delete a payment by its ID
router.delete('/:id', paymentController.delete);

module.exports = router;
