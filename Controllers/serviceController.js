const serviceService = require('../Services/serviceService');

const serviceController = {
    async createService(req, res) {
        try {
            const serviceData = req.body; // send service_types as array from frontend
            const service = await serviceService.createService(serviceData);
            res.status(201).json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAllServices(req, res) {
        try {
            const services = await serviceService.getAllServices();
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getServiceById(req, res) {
        try {
            const { id } = req.params;
            const service = await serviceService.getServiceById(id);
            res.json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateService(req, res) {
        try {
            const { id } = req.params;
            const serviceData = req.body;
            const updatedService = await serviceService.updateService(id, serviceData);
            res.json(updatedService);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteService(req, res) {
        try {
            const { id } = req.params;
            const result = await serviceService.deleteService(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = serviceController;
