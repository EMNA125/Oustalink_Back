const commentService = require('../Services/commentService');

const commentController = {
    async create(req, res) {
        try {
            const { id_client, id_provider, comment } = req.body;
            const result = await commentService.createComment(id_client, id_provider, comment);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const result = await commentService.getAllComments();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await commentService.getCommentById(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;
            const result = await commentService.updateComment(id, comment);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await commentService.deleteComment(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = commentController;
