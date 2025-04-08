const { supabase } = require('../config/db');

const appointmentService = {
    async createAppointment(appointmentData) {
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAllAppointments() {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('start_date', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getAppointmentById(id) {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async updateAppointment(id, appointmentData) {
        const { data, error } = await supabase
            .from('appointments')
            .update(appointmentData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteAppointment(id) {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Appointment with id ${id} deleted successfully` };
    },
};

module.exports = appointmentService;
