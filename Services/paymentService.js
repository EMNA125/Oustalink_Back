const { supabase } = require('../config/db');

const paymentService = {
    // Create a new payment
    async createPayment(id_service_provider, amount, method, status = 'PENDING', transaction_id, receipt) {
        const { data, error } = await supabase
            .from('payments')
            .insert([{ id_service_provider, amount, method, status, transaction_id, receipt }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all payments
    async getAllPayments() {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get a payment by its ID
    async getPaymentById(id) {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Get payments by service provider ID
    async getPaymentsByServiceProvider(id_service_provider) {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('id_service_provider', id_service_provider)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Update a payment by its ID
    async updatePayment(id, newAmount, newMethod, newStatus, newTransactionId, newReceipt) {
        const { data, error } = await supabase
            .from('payments')
            .update({ amount: newAmount, method: newMethod, status: newStatus, transaction_id: newTransactionId, receipt: newReceipt })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a payment by its ID
    async deletePayment(id) {
        const { error } = await supabase
            .from('payments')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { message: `Payment with id ${id} deleted successfully` };
    },
};

module.exports = paymentService;
