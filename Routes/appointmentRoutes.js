const express = require('express');
const router = express.Router();
const appointmentController = require('../Controllers/appointmentController');

router.post('/create', appointmentController.create);
router.get('/getall', appointmentController.getAll);
router.get('/appointment/:id', appointmentController.getById);
router.put('/appointment/:id', appointmentController.update);
router.delete('/:id', appointmentController.remove);

module.exports = router;
