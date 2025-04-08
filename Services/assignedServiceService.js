const { supabase } = require('../config/db');

const assignedServiceService = {
    async createAssignedService(id_employee, id_service) {
        const { data, error } = await supabase
            .from('assigned_services')
            .insert([{ id_employee, id_service }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAllAssignedServices() {
        const { data, error } = await supabase
            .from('assigned_services')
            .select('*');

        if (error) throw error;
        return data;
    },

    async getAssignedServiceById(id) {
        const { data, error } = await supabase
            .from('assigned_services')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async updateAssignedService(id, id_employee, id_service) {
        const { data, error } = await supabase
            .from('assigned_services')
            .update({ id_employee, id_service })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteAssignedService(id) {
        const { error } = await supabase
            .from('assigned_services')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Assigned Service with id ${id} deleted successfully` };
    },
};

module.exports = assignedServiceService;
