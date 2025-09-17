import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Environment check:");
console.log("All env vars:", import.meta.env);
console.log("Supabase Configuration:");
console.log("URL:", supabaseUrl);
console.log("URL type:", typeof supabaseUrl);
console.log("URL length:", supabaseUrl?.length);
console.log("Anon Key present:", !!supabaseAnonKey);
console.log("Anon Key length:", supabaseAnonKey?.length);

let supabase: SupabaseClient;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === "undefined" ||
  supabaseAnonKey === "undefined"
) {
  console.error("Missing or invalid environment variables:");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error("VITE_SUPABASE_ANON_KEY present:", !!supabaseAnonKey);

  // Fallback to prevent app crash - use mock values for development
  console.warn("Using fallback Supabase configuration");
  const fallbackUrl = "https://placeholder.supabase.co";
  const fallbackKey = "placeholder-key";

  supabase = createClient(fallbackUrl, fallbackKey);
} else {
  // Validate URL format
  try {
    new URL(supabaseUrl);
    console.log("✅ Supabase URL is valid");
  } catch (e) {
    console.error("❌ Invalid Supabase URL format:", supabaseUrl);
    throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export type UserChatHistory = {
  id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type UserMoodEntry = {
  id: string;
  user_id: string;
  mood: number;
  notes: string;
  date: string;
};

export type UserWellnessPlan = {
  id: string;
  user_id: string;
  date: string;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
};
