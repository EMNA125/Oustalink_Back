const { supabase } = require('../config/db');

const commentService = {
    async createComment(id_client, id_provider, comment) {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ id_client, id_provider, comment }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAllComments() {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getCommentById(id) {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async updateComment(id, newComment) {
        const { data, error } = await supabase
            .from('comments')
            .update({ comment: newComment })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteComment(id) {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Comment with id ${id} deleted successfully` };
    },
};

module.exports = commentService;
