const express = require('express');
const router = express.Router();
const ratingController = require('../Controllers/ratingController');

// Create a new rating
router.post('/create', ratingController.create);

// Get all ratings
router.get('/getall', ratingController.getAll);

// Get ratings by client ID
router.get('/client/:id_client', ratingController.getByClientId);

// Get ratings by service provider ID
router.get('/provider/:id_service_provider', ratingController.getByServiceProviderId);

// Get a rating by its ID
router.get('/:id', ratingController.getById);

// Update a rating by its ID
router.put('/:id', ratingController.update);

// Delete a rating by its ID
router.delete('/:id', ratingController.delete);

module.exports = router;
