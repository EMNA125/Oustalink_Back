// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');


require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Admin key for admin actions

const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Admin Supabase client (for privileged actions like deleting users)
const supabaseAdmin = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});
module.exports = { supabase, supabaseAdmin };






