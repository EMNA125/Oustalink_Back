const express = require('express');
const router = express.Router();
const assignedServiceController = require('../Controllers/assignedServiceController');

// Create
router.post('/create', assignedServiceController.create);

// Get All
router.get('/getall', assignedServiceController.getAll);

// Get by ID
router.get('assignedService/:id', assignedServiceController.getById);

// Update
router.put('assignedService/:id', assignedServiceController.update);

// Delete
router.delete('/:id', assignedServiceController.delete);

module.exports = router;
