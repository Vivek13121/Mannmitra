import { create } from "zustand";
import { persist } from "zustand/middleware";
import { startOfToday } from "date-fns";
import { supabase } from "./supabase";

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  notes: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface WellnessPlan {
  id: string;
  date: Date;
  tasks: { id: string; title: string; completed: boolean }[];
}

interface AppState {
  moodEntries: MoodEntry[];
  chatHistory: ChatMessage[];
  wellnessPlans: WellnessPlan[];
  addMoodEntry: (mood: number, notes: string) => Promise<void>;
  addChatMessage: (role: "user" | "assistant", content: string) => Promise<void>;
  addWellnessPlan: (tasks: string[]) => Promise<void>;
  toggleTask: (planId: string, taskId: string) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  loadUserData: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      moodEntries: [],
      chatHistory: [],
      wellnessPlans: [],

      addMoodEntry: async (mood, notes) => {
        const entry: MoodEntry = { id: crypto.randomUUID(), date: new Date(), mood, notes };
        set((state) => ({ moodEntries: [...state.moodEntries, entry] }));

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_mood_entries").insert({ user_id: user.id, mood, notes, date: entry.date });
        }
      },

      addChatMessage: async (role, content) => {
        const message: ChatMessage = { id: crypto.randomUUID(), role, content, timestamp: new Date() };
        set((state) => ({ chatHistory: [...state.chatHistory, message] }));

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_chat_history").insert({ user_id: user.id, role, content, timestamp: message.timestamp });
        }
      },

      addWellnessPlan: async (tasks) => {
        const plan: WellnessPlan = {
          id: crypto.randomUUID(),
          date: startOfToday(),
          tasks: tasks.map((title) => ({ id: crypto.randomUUID(), title, completed: false })),
        };
        set((state) => ({ wellnessPlans: [...state.wellnessPlans, plan] }));

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_wellness_plans").insert({ user_id: user.id, date: plan.date, tasks: plan.tasks });
        }
      },

      toggleTask: async (planId, taskId) => {
        const updatedPlans = get().wellnessPlans.map((plan) =>
          plan.id === planId
            ? { ...plan, tasks: plan.tasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task) }
            : plan
        );
        const plan = updatedPlans.find((p) => p.id === planId);
        if (!plan) return;
        set({ wellnessPlans: updatedPlans });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_wellness_plans").update({ tasks: plan.tasks }).eq("id", planId).eq("user_id", user.id);
        }
      },

      clearChatHistory: async () => {
        set({ chatHistory: [] });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_chat_history").delete().eq("user_id", user.id);
        }
      },

      loadUserData: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [chatHistory, moodEntries, wellnessPlans] = await Promise.all([
          supabase.from("user_chat_history").select("*").eq("user_id", user.id).order("timestamp", { ascending: true }),
          supabase.from("user_mood_entries").select("*").eq("user_id", user.id).order("date", { ascending: true }),
          supabase.from("user_wellness_plans").select("*").eq("user_id", user.id).order("date", { ascending: true }),
        ]);

        set({
          chatHistory: chatHistory.data?.map((msg) => ({ id: msg.id, role: msg.role as "user" | "assistant", content: msg.content, timestamp: new Date(msg.timestamp) })) || [],
          moodEntries: moodEntries.data?.map((entry) => ({ id: entry.id, date: new Date(entry.date), mood: entry.mood, notes: entry.notes || "" })) || [],
          wellnessPlans: wellnessPlans.data?.map((plan) => ({ id: plan.id, date: new Date(plan.date), tasks: plan.tasks })) || [],
        });
      },
    }),
    { name: "mannmitra-storage" }
  )
);

// Keep signed-in/admin flows compatible. Anonymous users rely entirely on Zustand persistence.
supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_IN") useStore.getState().loadUserData();
});
