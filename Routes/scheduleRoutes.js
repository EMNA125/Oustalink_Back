const express = require('express');
const router = express.Router();
const scheduleController = require('../Controllers/scheduleController');

router.post('/create', scheduleController.createSchedule);
router.get('/getall', scheduleController.getAllSchedules);
router.get('/schedule/:id', scheduleController.getScheduleById);
router.put('/schedule/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
