const appointmentService = require('../Services/appointmentService');

const appointmentController = {
    async create(req, res) {
        try {
            const appointment = await appointmentService.createAppointment(req.body);
            res.status(201).json(appointment);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getAll(req, res) {
        try {
            const appointments = await appointmentService.getAllAppointments();
            res.status(200).json(appointments);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const appointment = await appointmentService.getAppointmentById(req.params.id);
            res.status(200).json(appointment);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
            res.status(200).json(appointment);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const message = await appointmentService.deleteAppointment(req.params.id);
            res.status(200).json(message);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};

module.exports = appointmentController;
