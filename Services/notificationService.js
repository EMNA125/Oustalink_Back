const { supabase } = require('../config/db');

const notificationService = {
    // Create a new notification
    async createNotification(id_user, content, status = 'UNREAD') {
        const { data, error } = await supabase
            .from('notifications')
            .insert([{ id_user, content, status }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all notifications
    async getAllNotifications() {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get notifications by user ID
    async getNotificationsByUserId(id_user) {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('id_user', id_user)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get a notification by its ID
    async getNotificationById(id) {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Update a notification by its ID
    async updateNotification(id, newContent, newStatus) {
        const { data, error } = await supabase
            .from('notifications')
            .update({ content: newContent, status: newStatus })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a notification by its ID
    async deleteNotification(id) {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Notification with id ${id} deleted successfully` };
    },
};

module.exports = notificationService;
