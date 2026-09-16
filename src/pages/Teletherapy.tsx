import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, MapPin, Video, Star, User, Phone, Mail,
  ChevronRight, CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import { useBookingStore, mockTherapists, mockBookings } from "../lib/booking-store";

interface BookingFormData {
  therapist_id: string;
  appointment_date: string;
  appointment_time: string;
  mode: "online" | "offline";
  notes: string;
}

const getAnonymousId = () => {
  const key = "mannmitra-anonymous-id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = `anon_${crypto.randomUUID()}`;
  localStorage.setItem(key, id);
  return id;
};

const BookingSystem: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<"browse" | "select" | "book" | "confirmation">("browse");
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormData>({ therapist_id: "", appointment_date: "", appointment_time: "", mode: "online", notes: "" });
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [anonymousId, setAnonymousId] = useState("");

  const {
    therapists, bookings, loading, error, fetchTherapists, fetchBookings,
    createBooking, clearError,
  } = useBookingStore();

  useEffect(() => {
    const id = getAnonymousId();
    setAnonymousId(id);
    fetchTherapists();
    fetchBookings(id);
  }, [fetchTherapists, fetchBookings]);

  const displayTherapists = therapists.length > 0 ? therapists : mockTherapists;
  const displayBookings = bookings.length > 0 ? bookings : mockBookings;

  useEffect(() => {
    if (bookingForm.appointment_date && selectedTherapist) {
      const slots: string[] = [];
      for (let hour = 9; hour < 18; hour++) {
        const time = `${hour.toString().padStart(2, "0")}:00`;
        const isBooked = displayBookings.some((booking) =>
          booking.therapist_id === selectedTherapist.id &&
          booking.appointment_date === bookingForm.appointment_date &&
          booking.appointment_time === time &&
          ["pending", "accepted"].includes(booking.status)
        );
        if (!isBooked) slots.push(time);
      }
      setAvailableSlots(slots);
    }
  }, [bookingForm.appointment_date, selectedTherapist, displayBookings]);

  const handleTherapistSelect = (therapist: any) => {
    setSelectedTherapist(therapist);
    setBookingForm((prev) => ({ ...prev, therapist_id: therapist.id }));
    setCurrentStep("book");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonymousId) return;

    try {
      await createBooking({ ...bookingForm, student_anon_id: anonymousId, status: "pending" as const });
      setBookingSuccess(true);
      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "accepted": return "text-green-600 bg-green-100";
      case "declined": return "text-red-600 bg-red-100";
      case "completed": return "text-blue-600 bg-blue-100";
      case "cancelled": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="w-4 h-4" />;
      case "accepted": case "completed": return <CheckCircle className="w-4 h-4" />;
      case "declined": case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredTherapists = displayTherapists.filter((therapist) => {
    const matchesSpecialization = !filterSpecialization || therapist.specialization.toLowerCase().includes(filterSpecialization.toLowerCase());
    const matchesLanguage = !filterLanguage || therapist.languages.toLowerCase().includes(filterLanguage.toLowerCase());
    return matchesSpecialization && matchesLanguage;
  });

  if (currentStep === "confirmation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="container mx-auto px-4"><div className="max-w-2xl mx-auto"><div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your appointment has been scheduled successfully. You will receive a confirmation shortly.</p>
          <div className="bg-gray-50 rounded-lg p-6 mb-6"><h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3><div className="space-y-2 text-left">
            <div className="flex items-center"><User className="w-4 h-4 text-gray-500 mr-2" /><span>{selectedTherapist?.name}</span></div>
            <div className="flex items-center"><Calendar className="w-4 h-4 text-gray-500 mr-2" /><span>{new Date(bookingForm.appointment_date).toLocaleDateString()}</span></div>
            <div className="flex items-center"><Clock className="w-4 h-4 text-gray-500 mr-2" /><span>{bookingForm.appointment_time}</span></div>
            <div className="flex items-center">{bookingForm.mode === "online" ? <Video className="w-4 h-4 text-gray-500 mr-2" /> : <MapPin className="w-4 h-4 text-gray-500 mr-2" />}<span className="capitalize">{bookingForm.mode} Session</span></div>
          </div></div>
          <button onClick={() => { setCurrentStep("browse"); setSelectedTherapist(null); setBookingForm({ therapist_id: "", appointment_date: "", appointment_time: "", mode: "online", notes: "" }); }} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">Book Another Session</button>
        </div></div></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8"><h1 className="text-4xl font-bold text-gray-900 mb-4">Book a Session with Mental Health Professionals</h1><p className="text-lg text-gray-600 max-w-3xl mx-auto">Connect with qualified therapists and counselors. Get the support you need, when you need it.</p></div>
        <div className="flex justify-center mb-8"><div className="flex items-center space-x-4"><div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${currentStep === "browse" ? "bg-purple-100 text-purple-700" : "text-gray-500"}`}><span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center">1</span><span>Browse Therapists</span></div><ChevronRight className="w-5 h-5 text-gray-400" /><div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${currentStep === "book" ? "bg-purple-100 text-purple-700" : "text-gray-500"}`}><span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center">2</span><span>Book Session</span></div></div></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "browse" && <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6"><h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Therapists</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label><select value={filterSpecialization} onChange={(e) => setFilterSpecialization(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="">All Specializations</option><option value="anxiety">Anxiety & Stress</option><option value="depression">Depression</option><option value="academic">Academic Stress</option><option value="trauma">Trauma & PTSD</option><option value="relationship">Relationship Issues</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Language</label><select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="">All Languages</option><option value="english">English</option><option value="hindi">Hindi</option><option value="bengali">Bengali</option><option value="gujarati">Gujarati</option><option value="marathi">Marathi</option></select></div>
              </div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{filteredTherapists.map((therapist) => <div key={therapist.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start space-x-4"><img src={therapist.profile_image_url} alt={therapist.name} className="w-16 h-16 rounded-full object-cover" /><div className="flex-1"><h3 className="text-lg font-semibold text-gray-900">{therapist.name}</h3><p className="text-purple-600 font-medium">{therapist.specialization}</p><div className="flex items-center mt-2"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="text-sm text-gray-600 ml-1">{therapist.rating} ({therapist.total_sessions} sessions)</span></div></div></div>
                <p className="text-gray-600 mt-4 text-sm line-clamp-3">{therapist.bio}</p><div className="mt-4"><div className="flex items-center text-sm text-gray-500 mb-2"><MapPin className="w-4 h-4 mr-1" /><span>{therapist.center_name}</span></div><div className="flex items-center text-sm text-gray-500 mb-2"><User className="w-4 h-4 mr-1" /><span>{therapist.experience_years} years experience</span></div><div className="flex items-center text-sm text-gray-500"><span className="font-medium">Languages: {therapist.languages}</span></div></div>
                <div className="flex items-center justify-between mt-4"><div className="flex space-x-2">{therapist.online_consultation && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Online</span>}{therapist.offline_consultation && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">In-person</span>}</div><span className="text-lg font-semibold text-purple-600">₹{therapist.hourly_rate}/hr</span></div>
                <button onClick={() => handleTherapistSelect(therapist)} className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">Book Session</button>
              </div>)}</div>
            </div>}

            {currentStep === "book" && selectedTherapist && <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6"><button type="button" onClick={() => setCurrentStep("browse")} className="text-purple-600 hover:text-purple-800 mr-4">← Back to Therapists</button><h2 className="text-2xl font-bold text-gray-900">Book Session with {selectedTherapist.name}</h2></div>
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label><input type="date" required min={new Date().toISOString().split("T")[0]} value={bookingForm.appointment_date} onChange={(e) => setBookingForm((prev) => ({ ...prev, appointment_date: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label><select required value={bookingForm.appointment_time} onChange={(e) => setBookingForm((prev) => ({ ...prev, appointment_time: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2"><option value="">Select a time</option>{availableSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Session Mode</label><div className="flex gap-4"><label><input type="radio" value="online" checked={bookingForm.mode === "online"} onChange={() => setBookingForm((prev) => ({ ...prev, mode: "online" }))} /> <span className="ml-2">Online</span></label><label><input type="radio" value="offline" checked={bookingForm.mode === "offline"} onChange={() => setBookingForm((prev) => ({ ...prev, mode: "offline" }))} /> <span className="ml-2">In-person</span></label></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label><textarea value={bookingForm.notes} onChange={(e) => setBookingForm((prev) => ({ ...prev, notes: e.target.value }))} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Anything you'd like the therapist to know..." /></div>
                <button type="submit" disabled={loading || !anonymousId} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50">{loading ? "Booking..." : "Confirm Booking"}</button>
              </form>
            </div>}
          </div>
          <div className="lg:col-span-1"><div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-xl font-semibold text-gray-900 mb-4">Your Bookings</h3>{displayBookings.length === 0 ? <p className="text-gray-500">No bookings yet.</p> : <div className="space-y-4">{displayBookings.slice(0, 5).map((booking) => <div key={booking.id} className="border border-gray-200 rounded-lg p-4"><div className="flex items-center justify-between mb-2"><span className="font-medium text-gray-900">{booking.therapist?.name || displayTherapists.find((t) => t.id === booking.therapist_id)?.name || "Therapist"}</span><span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getStatusColor(booking.status)}`}>{getStatusIcon(booking.status)}{booking.status}</span></div><div className="text-sm text-gray-600"><p>{booking.appointment_date} at {booking.appointment_time}</p><p className="capitalize">{booking.mode} session</p></div></div>)}</div>}</div></div>
        </div>
        {error && <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex justify-between"><span>{error}</span><button onClick={clearError} className="font-medium">Dismiss</button></div>}
        <div className="mt-8 text-center text-sm text-gray-500"><div className="flex justify-center gap-6"><span className="flex items-center gap-1"><Phone className="w-4 h-4" /> Emergency: 112</span><span className="flex items-center gap-1"><Mail className="w-4 h-4" /> Confidential Support Available</span></div></div>
      </div>
    </div>
  );
};

export default BookingSystem;
