import { supabase } from "./src/lib/supabase.ts";

async function testSupabaseAuth() {
  console.log("🔥 Testing Supabase Authentication...");

  try {
    // Test 1: Sign up new user
    console.log("1. Testing Sign Up...");
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "TestPassword123!";

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: testEmail,
        password: testPassword,
      }
    );

    if (signUpError) {
      console.error("❌ Sign up failed:", signUpError.message);
      return false;
    }

    console.log("✅ Sign up successful! User ID:", signUpData.user?.id);

    // Test 2: Sign in
    console.log("2. Testing Sign In...");
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    if (signInError) {
      console.error("❌ Sign in failed:", signInError.message);
      return false;
    }

    console.log("✅ Sign in successful! Session:", !!signInData.session);

    // Test 3: Database insert
    console.log("3. Testing Database Insert...");
    const { data: insertData, error: insertError } = await supabase
      .from("user_chat_history")
      .insert({
        user_id: signInData.user.id,
        role: "user",
        content: "Test message",
        timestamp: new Date().toISOString(),
      });

    if (insertError) {
      console.error("❌ Database insert failed:", insertError.message);
      return false;
    }

    console.log("✅ Database insert successful!");

    // Test 4: Database read
    console.log("4. Testing Database Read...");
    const { data: readData, error: readError } = await supabase
      .from("user_chat_history")
      .select("*")
      .eq("user_id", signInData.user.id);

    if (readError) {
      console.error("❌ Database read failed:", readError.message);
      return false;
    }

    console.log("✅ Database read successful! Records:", readData?.length);

    console.log("🎉 All tests passed! Supabase is working correctly.");
    return true;
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    return false;
  }
}

testSupabaseAuth();
