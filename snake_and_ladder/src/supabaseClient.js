import { createClient } from '@supabase/supabase-js'

// FIXED: Added "https://" and ".supabase.co" around your ID
const supabaseUrl = "https://ddzxvknrczvhwmposomw.supabase.co"

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkenh2a25yY3p2aHdtcG9zb213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzA1MDgsImV4cCI6MjA4MDc0NjUwOH0.9vdx1rspn5T0hzzs47BYCuiqqBQAszJH_Av6j82lIP0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)