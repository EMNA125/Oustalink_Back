const { supabase } = require('../config/db');

const ratingService = {
    // Create a new rating
    async createRating(id_client, id_service_provider, rating) {
        const { data, error } = await supabase
            .from('ratings')
            .insert([{ id_client, id_service_provider, rating }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all ratings
    async getAllRatings() {
        const { data, error } = await supabase
            .from('ratings')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get ratings by client ID
    async getRatingsByClientId(id_client) {
        const { data, error } = await supabase
            .from('ratings')
            .select('*')
            .eq('id_client', id_client);

        if (error) throw error;
        return data;
    },

    // Get ratings by service provider ID
    async getRatingsByServiceProviderId(id_service_provider) {
        const { data, error } = await supabase
            .from('ratings')
            .select('*')
            .eq('id_service_provider', id_service_provider);

        if (error) throw error;
        return data;
    },

    // Get a rating by its ID
    async getRatingById(id) {
        const { data, error } = await supabase
            .from('ratings')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Update a rating by its ID
    async updateRating(id, newRating) {
        const { data, error } = await supabase
            .from('ratings')
            .update({ rating: newRating })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a rating by its ID
    async deleteRating(id) {
        const { error } = await supabase
            .from('ratings')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Rating with id ${id} deleted successfully` };
    },
};

module.exports = ratingService;
