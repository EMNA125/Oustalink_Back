const ratingService = require('../Services/ratingService');

const ratingController = {
    // Create a new rating
    async create(req, res) {
        try {
            const { id_client, id_service_provider, rating } = req.body;
            const result = await ratingService.createRating(id_client, id_service_provider, rating);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all ratings
    async getAll(req, res) {
        try {
            const result = await ratingService.getAllRatings();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get ratings by client ID
    async getByClientId(req, res) {
        try {
            const { id_client } = req.params;
            const result = await ratingService.getRatingsByClientId(id_client);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get ratings by service provider ID
    async getByServiceProviderId(req, res) {
        try {
            const { id_service_provider } = req.params;
            const result = await ratingService.getRatingsByServiceProviderId(id_service_provider);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a rating by its ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await ratingService.getRatingById(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a rating by its ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const { rating } = req.body;
            const result = await ratingService.updateRating(id, rating);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a rating by its ID
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await ratingService.deleteRating(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = ratingController;
