// Test Supabase connection directly
const testSupabaseConnection = async () => {
  const supabaseUrl = "https://vngviygywvralfxysldu.supabase.co";
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZ3ZieWd5d3ZyYWxmeHlzbGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDA0NTEsImV4cCI6MjA2MDAxNjQ1MX0.JbLcrShsjRq9ucEVP2sW8WqFdQa_1n-ecnONSLFrpD0";

  console.log("Testing Supabase connection...");
  console.log("URL:", supabaseUrl);
  console.log(
    "Key (first 20 chars):",
    supabaseAnonKey.substring(0, 20) + "..."
  );

  try {
    // Test basic API endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.status === 401) {
      console.error(
        "❌ 401 Unauthorized - API key is invalid or project is paused/deleted"
      );
    } else if (response.status === 200) {
      console.log("✅ Supabase connection successful");
    } else {
      console.log("⚠️ Unexpected status:", response.status);
    }

    const responseText = await response.text();
    console.log("Response body:", responseText);
  } catch (error) {
    console.error("❌ Connection error:", error);
  }
};

// Run the test
testSupabaseConnection();
