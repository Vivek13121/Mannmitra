import { create } from "zustand";
import { supabase } from "./supabase";

export interface Therapist {
  id: string;
  name: string;
  specialization: string;
  languages: string;
  center_name: string;
  center_address: string;
  bio: string;
  experience_years: number;
  rating: number;
  total_sessions: number;
  is_available: boolean;
  online_consultation: boolean;
  offline_consultation: boolean;
  hourly_rate: number;
  profile_image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  student_anon_id: string;
  therapist_id: string;
  appointment_date: string;
  appointment_time: string;
  mode: "online" | "offline";
  status: "pending" | "accepted" | "declined" | "completed" | "cancelled";
  notes?: string;
  meeting_link?: string;
  meeting_address?: string;
  created_at: string;
  updated_at: string;
  therapist?: Therapist;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingStore {
  therapists: Therapist[];
  bookings: Booking[];
  selectedTherapist: Therapist | null;
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  newBookingNotification: boolean;

  // Actions
  fetchTherapists: () => Promise<void>;
  fetchBookings: (anonId?: string) => Promise<void>;
  fetchAvailableSlots: (therapistId: string, date: string) => Promise<void>;
  createBooking: (
    bookingData: Omit<Booking, "id" | "created_at" | "updated_at" | "therapist">
  ) => Promise<Booking>;
  updateBookingStatus: (
    bookingId: string,
    status: Booking["status"],
    meetingLink?: string,
    meetingAddress?: string
  ) => Promise<void>;
  setSelectedTherapist: (therapist: Therapist | null) => void;
  clearError: () => void;
  clearNewBookingNotification: () => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  therapists: [],
  bookings: [],
  selectedTherapist: null,
  availableSlots: [],
  loading: false,
  error: null,
  newBookingNotification: false,

  fetchTherapists: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("therapists")
        .select("*")
        .eq("is_available", true)
        .order("name");

      if (error) {
        console.error("Supabase therapists fetch error:", error);
        throw error;
      }

      console.log("Fetched therapists from Supabase:", data);
      set({ therapists: data || [] });
    } catch (error) {
      console.error("Error fetching therapists:", error);

      // Fall back to mock data for demo purposes
      console.log("Using mock therapists:", mockTherapists);
      set({
        therapists: mockTherapists,
        error: null, // Clear error since we're using mock data
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchBookings: async (anonId?: string) => {
    set({ loading: true, error: null });
    try {
      let query = supabase
        .from("bookings")
        .select(
          `
          *,
          therapist:therapists(*)
        `
        )
        .order("created_at", { ascending: false });

      if (anonId) {
        query = query.eq("student_anon_id", anonId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase fetch error:", error);
        throw error;
      }

      console.log("Fetched bookings from Supabase:", data);
      set({ bookings: data || [] });
    } catch (error) {
      console.error("Error fetching bookings:", error);

      // Only use mock data if we don't have any real bookings
      // Preserve any existing bookings that were created locally
      const currentBookings = get().bookings;
      if (currentBookings.length === 0) {
        let filteredMockBookings = mockBookings;
        if (anonId) {
          filteredMockBookings = mockBookings.filter(
            (b) => b.student_anon_id === anonId
          );
        }

        console.log(
          "Using mock bookings (no real bookings found):",
          filteredMockBookings
        );
        set({
          bookings: filteredMockBookings,
          error: null, // Clear error since we're using mock data
        });
      } else {
        console.log("Keeping existing real bookings:", currentBookings);
        set({ error: null }); // Just clear the error, keep existing bookings
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchAvailableSlots: async (therapistId: string, date: string) => {
    set({ loading: true, error: null });
    try {
      const slots: TimeSlot[] = [];
      for (let hour = 9; hour < 18; hour++) {
        const time = `${hour.toString().padStart(2, "0")}:00`;
        slots.push({ time, available: true });
      }

      const { data: bookedSlots, error } = await supabase
        .from("bookings")
        .select("appointment_time")
        .eq("therapist_id", therapistId)
        .eq("appointment_date", date)
        .in("status", ["pending", "accepted"]);

      if (error) throw error;

      const bookedTimes =
        bookedSlots?.map((slot) => slot.appointment_time) || [];
      const availableSlots = slots.map((slot) => ({
        ...slot,
        available: !bookedTimes.includes(slot.time),
      }));

      set({ availableSlots });
    } catch (error) {
      console.error("Error fetching available slots:", error);
      set({ error: "Failed to load available slots" });
    } finally {
      set({ loading: false });
    }
  },

  createBooking: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      console.log("Creating booking with data:", bookingData);

      const { data, error } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select(
          `
          *,
          therapist:therapists(*)
        `
        )
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Booking created successfully:", data);

      // Update the bookings list to include the new booking
      const currentBookings = get().bookings;
      const updatedBookings = [data, ...currentBookings];
      console.log("Updated bookings list:", updatedBookings);
      set({
        bookings: updatedBookings,
        newBookingNotification: true,
      });

      return data;
    } catch (error) {
      console.error("Error creating booking:", error);

      // Fall back to mock data for demo purposes
      const mockBooking = {
        id: `mock-${Date.now()}`,
        ...bookingData,
        therapist: mockTherapists.find(
          (t) => t.id === bookingData.therapist_id
        ),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Using mock booking:", mockBooking);

      // Update the bookings list with mock data
      const currentBookings = get().bookings;
      const updatedBookings = [mockBooking, ...currentBookings];
      console.log("Updated bookings list with mock data:", updatedBookings);
      set({
        bookings: updatedBookings,
        newBookingNotification: true,
        error: null, // Clear error since we're using mock data
      });

      return mockBooking;
    } finally {
      set({ loading: false });
    }
  },

  updateBookingStatus: async (
    bookingId,
    status,
    meetingLink,
    meetingAddress
  ) => {
    set({ loading: true, error: null });
    try {
      console.log("Updating booking status:", {
        bookingId,
        status,
        meetingLink,
        meetingAddress,
      });

      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (meetingLink) updateData.meeting_link = meetingLink;
      if (meetingAddress) updateData.meeting_address = meetingAddress;

      // Try to update in Supabase first
      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId);

      if (error) {
        console.log(
          "Supabase update failed, updating local state only:",
          error
        );
      } else {
        console.log("Supabase update successful");
      }

      // Update the local state regardless of Supabase success/failure
      // This ensures the UI updates even for mock bookings
      const currentBookings = get().bookings;
      const updatedBookings = currentBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status,
              meeting_link: meetingLink,
              meeting_address: meetingAddress,
              updated_at: new Date().toISOString(),
            }
          : booking
      );

      console.log("Updated local bookings:", updatedBookings);
      set({ bookings: updatedBookings });
    } catch (error) {
      console.error("Error updating booking:", error);

      // Even if Supabase fails, try to update local state for demo purposes
      const currentBookings = get().bookings;
      const updatedBookings = currentBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status,
              meeting_link: meetingLink,
              meeting_address: meetingAddress,
              updated_at: new Date().toISOString(),
            }
          : booking
      );

      console.log(
        "Fallback: Updated local bookings after error:",
        updatedBookings
      );
      set({ bookings: updatedBookings, error: null }); // Clear error since we updated locally
    } finally {
      set({ loading: false });
    }
  },

  setSelectedTherapist: (therapist) => {
    set({ selectedTherapist: therapist });
  },

  clearError: () => {
    set({ error: null });
  },

  clearNewBookingNotification: () => {
    set({ newBookingNotification: false });
  },
}));

// Mock data for demo purposes
export const mockTherapists: Therapist[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Anxiety & Stress Management",
    languages: "English, Hindi",
    center_name: "MindCare Center",
    center_address: "123 Wellness Street, Mumbai",
    bio: "Specialized in cognitive behavioral therapy with 8 years of experience helping students manage academic stress.",
    experience_years: 8,
    rating: 4.8,
    total_sessions: 156,
    is_available: true,
    online_consultation: true,
    offline_consultation: true,
    hourly_rate: 800,
    profile_image_url:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    specialization: "Depression & Mood Disorders",
    languages: "Hindi, English, Bengali",
    center_name: "Healing Hearts Clinic",
    center_address: "45 Peace Avenue, Delhi",
    bio: "Expert in treating depression and mood disorders with a holistic approach combining therapy and mindfulness.",
    experience_years: 12,
    rating: 4.9,
    total_sessions: 298,
    is_available: true,
    online_consultation: true,
    offline_consultation: true,
    hourly_rate: 1000,
    profile_image_url:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Dr. Priya Sharma",
    specialization: "Academic Stress & Performance",
    languages: "English, Hindi, Gujarati",
    center_name: "Student Wellness Hub",
    center_address: "78 Education Lane, Bangalore",
    bio: "Specialized in helping students overcome academic pressure and develop healthy study habits.",
    experience_years: 6,
    rating: 4.7,
    total_sessions: 89,
    is_available: true,
    online_consultation: true,
    offline_consultation: false,
    hourly_rate: 700,
    profile_image_url:
      "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=300",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Dr. Arjun Malhotra",
    specialization: "Trauma & PTSD",
    languages: "Hindi, Marathi, English",
    center_name: "Mindful Wellness Center",
    center_address: "12 Hope Street, Chennai",
    bio: "Licensed trauma specialist with expertise in EMDR and trauma-focused cognitive behavioral therapy, with cultural sensitivity in treatment approaches.",
    experience_years: 10,
    rating: 4.9,
    total_sessions: 187,
    is_available: true,
    online_consultation: true,
    offline_consultation: true,
    hourly_rate: 1200,
    profile_image_url:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockBookings: Booking[] = [
  {
    id: "1",
    student_anon_id: "demo-student-1",
    therapist_id: "1",
    appointment_date: new Date(Date.now() + 86400000 * 2)
      .toISOString()
      .split("T")[0],
    appointment_time: "14:00",
    mode: "online",
    status: "pending",
    notes: "Feeling overwhelmed with exams",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    therapist: mockTherapists[0],
  },
  {
    id: "2",
    student_anon_id: "demo-student-2",
    therapist_id: "2",
    appointment_date: new Date(Date.now() + 86400000 * 3)
      .toISOString()
      .split("T")[0],
    appointment_time: "10:00",
    mode: "offline",
    status: "accepted",
    notes: "Need help with time management",
    meeting_address: "45 Peace Avenue, Delhi",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    therapist: mockTherapists[1],
  },
  {
    id: "3",
    student_anon_id: "demo-student-3",
    therapist_id: "3",
    appointment_date: new Date(Date.now() + 86400000 * 1)
      .toISOString()
      .split("T")[0],
    appointment_time: "15:00",
    mode: "online",
    status: "completed",
    notes: "Academic stress counseling",
    meeting_link: "https://meet.google.com/abc-def-ghi",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    therapist: mockTherapists[2],
  },
];
