// src/lib/supabaseClient.js (MUST be this exact code structure)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check to ensure keys are loaded
if (!supabaseUrl || !supabaseAnonKey) {
    // This will throw the error if the console.log above shows 'undefined'
    throw new Error('Supabase URL or Anon Key is missing. Check your .env.local file and restart the server.');
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);