const express = require('express');
const router = express.Router();
const employeeController = require('../Controllers/employeeController');

router.post('/create', employeeController.createEmployee);
router.get('/employees', employeeController.getAllEmployees);
router.get('/employee/:id', employeeController.getEmployeeById);
router.put('/employee/:id', employeeController.updateEmployee);
router.delete('/employees/:id', employeeController.deleteEmployee);

module.exports = router;
