const { supabase } = require('../config/db');

const replyService = {
    // Create a new reply for a comment
    async createReply(id_comment, comment) {
        const { data, error } = await supabase
            .from('replies')
            .insert([{ id_comment, comment }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all replies
    async getAllReplies() {
        const { data, error } = await supabase
            .from('replies')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get a reply by its id
    async getReplyById(id) {
        const { data, error } = await supabase
            .from('replies')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Update a reply by its id
    async updateReply(id, newComment) {
        const { data, error } = await supabase
            .from('replies')
            .update({ comment: newComment })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a reply by its id
    async deleteReply(id) {
        const { error } = await supabase
            .from('replies')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Reply with id ${id} deleted successfully` };
    },
};

module.exports = replyService;
