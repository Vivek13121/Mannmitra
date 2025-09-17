import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabase-mock"; // Using anonymous auth

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
    (set) => ({
      moodEntries: [],
      chatHistory: [],
      wellnessPlans: [],

      addMoodEntry: async (mood: number, notes: string) => {
        const newEntry: MoodEntry = {
          id: Date.now().toString(),
          date: new Date(),
          mood,
          notes,
        };

        // Save to anonymous storage
        try {
          await supabase.from("user_mood_entries").insert({
            mood,
            notes,
            date: new Date().toISOString(),
          });
        } catch (error) {
          console.warn("Failed to save mood entry to storage:", error);
        }

        set((state) => ({
          moodEntries: [...state.moodEntries, newEntry],
        }));
      },

      addChatMessage: async (role: "user" | "assistant", content: string) => {
        const newMessage: ChatMessage = {
          id: Date.now().toString() + Math.random(),
          role,
          content,
          timestamp: new Date(),
        };

        // Save to anonymous storage
        try {
          await supabase.from("user_chat_history").insert({
            role,
            content,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.warn("Failed to save chat message to storage:", error);
        }

        set((state) => ({
          chatHistory: [...state.chatHistory, newMessage],
        }));
      },

      addWellnessPlan: async (tasks: string[]) => {
        const newPlan: WellnessPlan = {
          id: Date.now().toString(),
          date: new Date(),
          tasks: tasks.map((title, index) => ({
            id: `${Date.now()}-${index}`,
            title,
            completed: false,
          })),
        };

        // Save to anonymous storage
        try {
          await supabase.from("user_wellness_plans").insert({
            plan: newPlan,
          });
        } catch (error) {
          console.warn("Failed to save wellness plan to storage:", error);
        }

        set((state) => ({
          wellnessPlans: [...state.wellnessPlans, newPlan],
        }));
      },

      toggleTask: async (planId: string, taskId: string) => {
        set((state) => ({
          wellnessPlans: state.wellnessPlans.map((plan) =>
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
          ),
        }));
      },

      clearChatHistory: async () => {
        try {
          await supabase.from("user_chat_history").delete();
        } catch (error) {
          console.warn("Failed to clear chat history from storage:", error);
        }

        set(() => ({
          chatHistory: [],
        }));
      },

      loadUserData: async () => {
        // For anonymous users, data is already in localStorage via Zustand persist
        // The anonymous storage will handle persistence automatically
        console.log("Anonymous user data loaded from localStorage");
      },
    }),
    {
      name: "mannmitra-store",
      // Only persist essential data in localStorage
      partialize: (state) => ({
        moodEntries: state.moodEntries,
        chatHistory: state.chatHistory,
        wellnessPlans: state.wellnessPlans,
      }),
    }
  )
);
