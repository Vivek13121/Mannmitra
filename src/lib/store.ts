import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, startOfToday } from "date-fns";
import { supabase } from "./supabase"; // Using real Supabase
import type {
  UserChatHistory,
  UserMoodEntry,
  UserWellnessPlan,
} from "./supabase";

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
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

interface AppState {
  moodEntries: MoodEntry[];
  chatHistory: ChatMessage[];
  wellnessPlans: WellnessPlan[];
  addMoodEntry: (mood: number, notes: string) => Promise<void>;
  addChatMessage: (
    role: "user" | "assistant",
    content: string
  ) => Promise<void>;
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

      addMoodEntry: async (mood: number, notes: string) => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const entry = {
          id: crypto.randomUUID(),
          date: new Date(),
          mood,
          notes,
        };

        const { error } = await supabase.from("user_mood_entries").insert({
          user_id: user.data.user.id,
          mood,
          notes,
          date: entry.date,
        });

        if (!error) {
          set((state) => ({
            moodEntries: [...state.moodEntries, entry],
          }));
        }
      },

      addChatMessage: async (role: "user" | "assistant", content: string) => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const message = {
          id: crypto.randomUUID(),
          role,
          content,
          timestamp: new Date(),
        };

        const { error } = await supabase.from("user_chat_history").insert({
          user_id: user.data.user.id,
          role,
          content,
          timestamp: message.timestamp,
        });

        if (!error) {
          set((state) => ({
            chatHistory: [...state.chatHistory, message],
          }));
        }
      },

      addWellnessPlan: async (tasks: string[]) => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const plan = {
          id: crypto.randomUUID(),
          date: startOfToday(),
          tasks: tasks.map((title) => ({
            id: crypto.randomUUID(),
            title,
            completed: false,
          })),
        };

        const { error } = await supabase.from("user_wellness_plans").insert({
          user_id: user.data.user.id,
          date: plan.date,
          tasks: plan.tasks,
        });

        if (!error) {
          set((state) => ({
            wellnessPlans: [...state.wellnessPlans, plan],
          }));
        }
      },

      toggleTask: async (planId: string, taskId: string) => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const updatedPlans = get().wellnessPlans.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                tasks: plan.tasks.map((task) =>
                  task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
                ),
              }
            : plan
        );

        const plan = updatedPlans.find((p) => p.id === planId);
        if (!plan) return;

        const { error } = await supabase
          .from("user_wellness_plans")
          .update({
            tasks: plan.tasks,
          })
          .eq("id", planId)
          .eq("user_id", user.data.user.id);

        if (!error) {
          set({ wellnessPlans: updatedPlans });
        }
      },

      clearChatHistory: async () => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const { error } = await supabase
          .from("user_chat_history")
          .delete()
          .eq("user_id", user.data.user.id);

        if (!error) {
          set({ chatHistory: [] });
        }
      },

      loadUserData: async () => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const [chatHistory, moodEntries, wellnessPlans] = await Promise.all([
          supabase
            .from("user_chat_history")
            .select("*")
            .eq("user_id", user.data.user.id)
            .order("timestamp", { ascending: true }),
          supabase
            .from("user_mood_entries")
            .select("*")
            .eq("user_id", user.data.user.id)
            .order("date", { ascending: true }),
          supabase
            .from("user_wellness_plans")
            .select("*")
            .eq("user_id", user.data.user.id)
            .order("date", { ascending: true }),
        ]);

        set({
          chatHistory:
            chatHistory.data?.map((msg) => ({
              id: msg.id,
              role: msg.role as "user" | "assistant",
              content: msg.content,
              timestamp: new Date(msg.timestamp),
            })) || [],
          moodEntries:
            moodEntries.data?.map((entry) => ({
              id: entry.id,
              date: new Date(entry.date),
              mood: entry.mood,
              notes: entry.notes || "",
            })) || [],
          wellnessPlans:
            wellnessPlans.data?.map((plan) => ({
              id: plan.id,
              date: new Date(plan.date),
              tasks: plan.tasks,
            })) || [],
        });
      },
    }),
    {
      name: "mannmitra-storage",
    }
  )
);

// Subscribe to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    useStore.getState().loadUserData();
  } else if (event === "SIGNED_OUT") {
    useStore.setState({
      moodEntries: [],
      chatHistory: [],
      wellnessPlans: [],
    });
  }
});
