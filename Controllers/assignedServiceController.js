const assignedServiceService = require('../Services/assignedServiceService');

const assignedServiceController = {
    async create(req, res) {
        try {
            const { id_employee, id_service } = req.body;
            const data = await assignedServiceService.createAssignedService(id_employee, id_service);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const data = await assignedServiceService.getAllAssignedServices();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const data = await assignedServiceService.getAssignedServiceById(id);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { id_employee, id_service } = req.body;
            const data = await assignedServiceService.updateAssignedService(id, id_employee, id_service);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const data = await assignedServiceService.deleteAssignedService(id);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = assignedServiceController;
