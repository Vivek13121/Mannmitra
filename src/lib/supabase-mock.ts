// Anonymous authentication system for student mental health platform
// Generates anonymous user IDs and stores data locally with option to sync to Supabase

interface AnonymousUser {
  id: string;
  sessionId: string;
  createdAt: string;
  isAnonymous: true;
}

class AnonymousAuthSystem {
  private currentUser: AnonymousUser | null = null;
  private readonly STORAGE_KEY = "mannmitra_anonymous_user";

  constructor() {
    this.initializeUser();
  }

  private generateAnonymousId(): string {
    // Generate a unique anonymous ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `anon_${timestamp}_${random}`;
  }

  private initializeUser(): void {
    // Try to get existing anonymous user from localStorage
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        console.log("🔐 Restored anonymous session:", this.currentUser?.id);
      } catch (error) {
        console.warn("Failed to restore anonymous session, creating new one");
        this.createNewAnonymousUser();
      }
    } else {
      this.createNewAnonymousUser();
    }
  }

  private createNewAnonymousUser(): void {
    this.currentUser = {
      id: this.generateAnonymousId(),
      sessionId: this.generateAnonymousId(),
      createdAt: new Date().toISOString(),
      isAnonymous: true,
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
    console.log("🎭 Created new anonymous user:", this.currentUser.id);
  }

  getCurrentUser(): AnonymousUser | null {
    return this.currentUser;
  }

  async getUser() {
    return {
      data: { user: this.currentUser },
      error: null,
    };
  }

  // No need for sign in/sign up - users are automatically anonymous
  async signInWithPassword() {
    return {
      data: { user: this.currentUser },
      error: null,
    };
  }

  async signUp() {
    return {
      data: { user: this.currentUser },
      error: null,
    };
  }

  async signOut() {
    // Create a new anonymous session instead of fully signing out
    this.createNewAnonymousUser();
    return { error: null };
  }

  // Reset session (useful for testing or if user wants fresh start)
  resetSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.createNewAnonymousUser();
  }
}

// Mock database operations that work with anonymous users
class MockDatabase {
  private readonly STORAGE_PREFIX = "mannmitra_data_";

  private getStorageKey(table: string, userId: string): string {
    return `${this.STORAGE_PREFIX}${table}_${userId}`;
  }

  async insert(table: string, data: any) {
    const user = authSystem.getCurrentUser();
    if (!user) {
      return { data: null, error: { message: "No anonymous user session" } };
    }

    const storageKey = this.getStorageKey(table, user.id);
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");

    const newRecord = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    existing.push(newRecord);
    localStorage.setItem(storageKey, JSON.stringify(existing));

    console.log(`💾 Saved to ${table}:`, newRecord);
    return { data: newRecord, error: null };
  }

  async select(table: string) {
    const user = authSystem.getCurrentUser();
    if (!user) {
      return { data: [], error: { message: "No anonymous user session" } };
    }

    const storageKey = this.getStorageKey(table, user.id);
    const data = JSON.parse(localStorage.getItem(storageKey) || "[]");

    return { data, error: null };
  }

  async update(table: string, data: any) {
    // For simplicity, just insert new record
    return this.insert(table, data);
  }

  async delete(table: string) {
    const user = authSystem.getCurrentUser();
    if (!user) {
      return { data: null, error: { message: "No anonymous user session" } };
    }

    const storageKey = this.getStorageKey(table, user.id);
    localStorage.removeItem(storageKey);

    return { data: null, error: null };
  }
}

// Create instances
const authSystem = new AnonymousAuthSystem();
const database = new MockDatabase();

// Export the mock Supabase interface
export const supabase = {
  auth: authSystem,
  from: (table: string) => ({
    insert: (data: any) => database.insert(table, data),
    select: () => database.select(table),
    update: (data: any) => database.update(table, data),
    delete: () => database.delete(table),
  }),
};

// Keep the original types
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
  plan: any;
  created_at: string;
  updated_at: string;
};
