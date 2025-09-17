// Minimal Supabase authentication test
const supabaseUrl = "https://vngviygywvralfxysldu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZ3ZieWd5d3ZyYWxmeHlzbGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDA0NTEsImV4cCI6MjA2MDAxNjQ1MX0.JbLcrShsjRq9ucEVP2sW8WqFdQa_1n-ecnONSLFrpD0";

// Test basic auth endpoint
export const testSupabaseAuth = async (email: string, password: string) => {
  try {
    const response = await fetch(
      `${supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const result = await response.json();
    console.log("Supabase auth test result:", result);

    if (!response.ok) {
      throw new Error(
        result.error_description || result.message || "Authentication failed"
      );
    }

    return result;
  } catch (error) {
    console.error("Supabase auth test error:", error);
    throw error;
  }
};
