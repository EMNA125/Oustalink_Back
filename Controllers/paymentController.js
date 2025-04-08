const paymentService = require('../Services/paymentService');

const paymentController = {
    // Create a new payment
    async create(req, res) {
        try {
            const { id_service_provider, amount, method, status, transaction_id, receipt } = req.body;
            const result = await paymentService.createPayment(id_service_provider, amount, method, status, transaction_id, receipt);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all payments
    async getAll(req, res) {
        try {
            const result = await paymentService.getAllPayments();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a payment by its ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await paymentService.getPaymentById(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get payments by service provider ID
    async getByServiceProvider(req, res) {
        try {
            const { id_service_provider } = req.params;
            const result = await paymentService.getPaymentsByServiceProvider(id_service_provider);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a payment by its ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const { amount, method, status, transaction_id, receipt } = req.body;
            const result = await paymentService.updatePayment(id, amount, method, status, transaction_id, receipt);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a payment by its ID
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await paymentService.deletePayment(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = paymentController;
