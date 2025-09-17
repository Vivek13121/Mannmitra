import { supabase } from "./src/lib/supabase.ts";

async function testSupabaseConnection() {
  try {
    console.log("Testing real Supabase connection...");

    // Test basic connection and auth
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Session:", session ? "Active" : "No session");

    // Try to create a test user (anonymous)
    const { data: authData, error: authError } =
      await supabase.auth.signInAnonymously();

    if (authError) {
      console.error("Auth error:", authError);
      return false;
    }

    console.log("Anonymous auth successful:", authData.user?.id);

    // Test database access
    const { data, error } = await supabase
      .from("user_chat_history")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Database error:", error);
      return false;
    }

    console.log("Database access successful!");
    return true;
  } catch (err) {
    console.error("Connection test failed:", err);
    return false;
  }
}

testSupabaseConnection();
