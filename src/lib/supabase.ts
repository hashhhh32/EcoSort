
import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase project URL and anon key for your project
const supabaseUrl = 'https://ptsbnywxgfgvmhhxszcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0c2JueXd4Z2Zndm1oaHhzemNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTU0NzUsImV4cCI6MjA1NjM5MTQ3NX0.pRYjmxro6gCzJ4d-h92YacRO4-hw_3KSTemHf6tcyws';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
