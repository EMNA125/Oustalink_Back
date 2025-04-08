const { supabase } = require('../config/db');

const scheduleService = {
    async createSchedule(scheduleData) {
        const { data, error } = await supabase
            .from('schedules')
            .insert([scheduleData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAllSchedules() {
        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .order('day');

        if (error) throw error;
        return data;
    },

    async getScheduleById(id) {
        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async updateSchedule(id, scheduleData) {
        const { data, error } = await supabase
            .from('schedules')
            .update(scheduleData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteSchedule(id) {
        const { data, error } = await supabase
            .from('schedules')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Schedule with ID ${id} deleted successfully`, data };
    },
};

module.exports = scheduleService;
