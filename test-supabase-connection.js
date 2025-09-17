// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vngviygywvralfxysldu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZ3ZieWd5d3ZyYWxmeHlzbGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDA0NTEsImV4cCI6MjA2MDAxNjQ1MX0.JbLcrShsjRq9ucEVP2sW8WqFdQa_1n-ecnONSLFrpD0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('user_chat_history').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

testConnection();
