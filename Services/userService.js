const { supabase } = require('../config/db');

async function getUserById(id) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error getting user with ID ${id}:`, error);
        throw error;
    }
    return data;
}

async function getUserByAuthId(auth_id) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', auth_id)
        .single();

    if (error) {
        console.error(`Error getting user with auth_id ${auth_id}:`, error);
        throw error;
    }
    return data;
}

async function updateUserProfile(userId, updatedData) {
    const { data, error } = await supabase
        .from('users')
        .update(updatedData)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error(`Error updating user profile with ID ${userId}:`, error);
        throw error;
    }
    return data;
}

async function deleteUser(userId) {
    // Consider the implications of deleting a user.
    // You might want to also delete related data in other tables (e.g., profiles).
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
    return { message: `User with ID ${userId} deleted successfully` };
}

async function getAllUsers() {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
    return data;
}

// You can add other user-related service methods here, e.g.,
// - getUsersByRole(role)
// - searchUsers(query)

module.exports = {
    getUserById,
    getUserByAuthId,
    updateUserProfile,
    deleteUser,
    getAllUsers,
    // Add other exported functions here
};