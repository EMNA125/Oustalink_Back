const notificationService = require('../Services/notificationService');

const notificationController = {
    // Create a new notification
    async create(req, res) {
        try {
            const { id_user, content, status } = req.body;
            const result = await notificationService.createNotification(id_user, content, status);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all notifications
    async getAll(req, res) {
        try {
            const result = await notificationService.getAllNotifications();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get notifications by user ID
    async getByUserId(req, res) {
        try {
            const { id_user } = req.params;
            const result = await notificationService.getNotificationsByUserId(id_user);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a notification by its ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await notificationService.getNotificationById(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a notification by its ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const { content, status } = req.body;
            const result = await notificationService.updateNotification(id, content, status);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a notification by its ID
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await notificationService.deleteNotification(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = notificationController;
