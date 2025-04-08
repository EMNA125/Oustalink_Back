const replyService = require('../Services/replyService');

const replyController = {
    // Create a new reply
    async create(req, res) {
        try {
            const { id_comment, comment } = req.body;
            const result = await replyService.createReply(id_comment, comment);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all replies
    async getAll(req, res) {
        try {
            const result = await replyService.getAllReplies();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a reply by its ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await replyService.getReplyById(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a reply by its ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;
            const result = await replyService.updateReply(id, comment);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a reply by its ID
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await replyService.deleteReply(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = replyController;
