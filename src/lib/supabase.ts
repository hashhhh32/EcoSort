
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://ejcniqfklgujnrtkkkfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqY25pcWZrbGd1am5ydGtra2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyMTU5MDUsImV4cCI6MjAyMjc5MTkwNX0.u58o_r_LSzQDS_QFrxw7fZx31QPOKGAn2GWJL0yrYL4';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
