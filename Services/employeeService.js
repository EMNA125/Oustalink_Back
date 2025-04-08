const { supabase } = require('../config/db');

const employeeService = {
    async createEmployee(employeeData) {
        const { data, error } = await supabase
            .from('employees')
            .insert([employeeData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAllEmployees() {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .order('firstname');

        if (error) throw error;
        return data;
    },

    async getEmployeeById(id) {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async updateEmployee(id, employeeData) {
        const { data, error } = await supabase
            .from('employees')
            .update(employeeData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteEmployee(id) {
        const { data, error } = await supabase
            .from('employees')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Employee with ID ${id} deleted successfully`, data };
    },
};

module.exports = employeeService;
