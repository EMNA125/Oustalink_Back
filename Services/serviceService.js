const { supabase } = require('../config/db');

const serviceService = {
    async createService(serviceData) {
        const { data, error } = await supabase
            .from('services')
            .insert([serviceData]) // serviceData = { title, service_types: [], price, description, estimated_time, id_category, id_service_provider }
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAllServices() {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('title');

        if (error) throw error;
        return data;
    },

    async getServiceById(id) {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async updateService(id, serviceData) {
        const { data, error } = await supabase
            .from('services')
            .update(serviceData) // Pass updated fields including service_types: []
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteService(id) {
        const { data, error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Service with ID ${id} deleted successfully`, data };
    },
};

module.exports = serviceService;
