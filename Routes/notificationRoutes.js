const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');

// Create a new notification
router.post('/create', notificationController.create);

// Get all notifications
router.get('/GetAll', notificationController.getAll);

// Get notifications by user ID
router.get('/user/:id_user', notificationController.getByUserId);

// Get a notification by its ID
router.get('/:id', notificationController.getById);

// Update a notification by its ID
router.put('/:id', notificationController.update);

// Delete a notification by its ID
router.delete('/:id', notificationController.delete);

module.exports = router;
