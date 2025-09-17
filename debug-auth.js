import { createClient } from "@supabase/supabase-js";

// Test Supabase connection
const supabaseUrl = "https://vngviygywvralfxysldu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZ3ZieWd5d3ZyYWxmeHlzbGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDA0NTEsImV4cCI6MjA2MDAxNjQ1MX0.JbLcrShsjRq9ucEVP2sW8WqFdQa_1n-ecnONSLFrpD0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Testing Supabase connection...");
console.log("URL:", supabaseUrl);
console.log("Anon Key:", supabaseAnonKey.substring(0, 20) + "...");

// Test auth
async function testAuth() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "testpassword",
    });

    if (error) {
      console.log("Auth error:", error.message);
    } else {
      console.log("Auth success:", data);
    }
  } catch (err) {
    console.log("Connection error:", err);
  }
}

testAuth();
