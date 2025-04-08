const { supabase } = require('../config/db'); // Destructure the 'supabase' property

const categoryService = {
    async createCategory(title, service_types) {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ title, service_types }])
            .select()
            .single();

        if (error) {
            console.error('Error creating category:', error);
            throw error;
        }
        return data;
    },

    async getAllCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('title');

        if (error) {
            console.error('Error getting all categories:', error);
            throw error;
        }
        return data;
    },

    async getCategoryById(id) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error getting category with ID ${id}:`, error);
            throw error;
        }
        return data;
    },

    async updateCategory(id, title, service_types) {
        const { data, error } = await supabase
            .from('categories')
            .update({ title, service_types })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Error updating category with ID ${id}:`, error);
            throw error;
        }
        return data;
    },

    async deleteCategory(id) {
        const { data, error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
            throw error;
        }
        return { message: `Category with ID ${id} deleted successfully` };
    },

    async getCategoriesByTitle(title) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .ilike('title', `%${title}%`)
            .order('title');

        if (error) {
            console.error(`Error getting categories by title "${title}":`, error);
            throw error;
        }
        return data;
    },

    async filterCategories(filters = {}) {
        let query = supabase.from('categories').select('*').order('title');

        if (filters.title) {
            query = query.ilike('title', `%${filters.title}%`);
        }

        if (filters.service_type) {
            query = query.contains('service_types', [filters.service_type]);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error filtering categories:', error);
            throw error;
        }
        return data;
    },

    async getCategoriesByServiceType(serviceType) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .contains('service_types', [serviceType])
            .order('title');

        if (error) {
            console.error(`Error getting categories by service type "${serviceType}":`, error);
            throw error;
        }
        return data;
    },
};

module.exports = categoryService;