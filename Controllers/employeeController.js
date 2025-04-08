const employeeService = require('../Services/employeeService');

const employeeController = {
    async createEmployee(req, res) {
        try {
            const employeeData = req.body;
            const employee = await employeeService.createEmployee(employeeData);
            res.status(201).json(employee);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAllEmployees(req, res) {
        try {
            const employees = await employeeService.getAllEmployees();
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getEmployeeById(req, res) {
        try {
            const { id } = req.params;
            const employee = await employeeService.getEmployeeById(id);
            res.status(200).json(employee);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateEmployee(req, res) {
        try {
            const { id } = req.params;
            const employeeData = req.body;
            const employee = await employeeService.updateEmployee(id, employeeData);
            res.status(200).json(employee);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteEmployee(req, res) {
        try {
            const { id } = req.params;
            const result = await employeeService.deleteEmployee(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = employeeController;
