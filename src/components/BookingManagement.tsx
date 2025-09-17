import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Bell,
  RefreshCw,
} from "lucide-react";
import {
  useBookingStore,
  type Booking,
  type Therapist,
  mockBookings,
  mockTherapists,
} from "../lib/booking-store";

const BookingManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingAddress, setMeetingAddress] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [statusPopup, setStatusPopup] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    action: "accept" | "decline" | null;
    bookingId: string;
  }>({ show: false, action: null, bookingId: "" });

  const {
    bookings,
    loading,
    error,
    newBookingNotification,
    fetchBookings,
    updateBookingStatus,
    clearNewBookingNotification,
  } = useBookingStore();

  // Combine real bookings with mock bookings, avoiding duplicates
  // Real bookings (from student submissions) take precedence
  const realBookingIds = new Set(bookings.map((b) => b.id));
  const uniqueMockBookings = mockBookings.filter(
    (mock) => !realBookingIds.has(mock.id)
  );
  const displayBookings = [...bookings, ...uniqueMockBookings];

  // Debug: Log the current state
  console.log("Admin Dashboard - Store bookings:", bookings);
  console.log("Admin Dashboard - Mock bookings:", mockBookings);
  console.log("Admin Dashboard - Display bookings:", displayBookings);
  console.log(
    "Admin Dashboard - New booking notification:",
    newBookingNotification
  );

  useEffect(() => {
    fetchBookings(); // Fetch all bookings for admin (no filter for admin)

    // Set up automatic refresh every 30 seconds to get new bookings
    const interval = setInterval(() => {
      fetchBookings();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchBookings]);

  // Listen for changes in bookings array and newBookingNotification
  useEffect(() => {
    console.log("Bookings updated in admin dashboard:", bookings);
    if (newBookingNotification) {
      console.log("New booking notification triggered!");
    }
  }, [bookings, newBookingNotification]);

  // Add a manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBookings();
    } catch (error) {
      console.error("Failed to refresh bookings:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusUpdate = async (
    bookingId: string,
    status: Booking["status"]
  ) => {
    try {
      await updateBookingStatus(bookingId, status);

      // For demo purposes, just update the mock data
      console.log(`Updated booking ${bookingId} to ${status}`);

      // Show success popup based on status
      let message = "";
      switch (status) {
        case "accepted":
          message = "✅ Booking request accepted successfully!";
          break;
        case "declined":
          message = "❌ Booking request declined";
          break;
        case "completed":
          message = "✅ Session marked as completed";
          break;
        default:
          message = `Booking status updated to ${status}`;
      }

      setStatusPopup({ show: true, message, type: "success" });

      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setStatusPopup({ show: false, message: "", type: "success" });
      }, 3000);

      if (status === "accepted") {
        setSelectedBooking(
          displayBookings.find((b) => b.id === bookingId) || null
        );
        setShowMeetingModal(true);
      }
    } catch (error) {
      console.error("Failed to update booking status:", error);
      setStatusPopup({
        show: true,
        message: "❌ Failed to update booking status",
        type: "error",
      });

      // Auto-hide error popup after 3 seconds
      setTimeout(() => {
        setStatusPopup({ show: false, message: "", type: "error" });
      }, 3000);
    }
  };

  const handleAcceptBooking = (bookingId: string) => {
    setConfirmAction({ show: true, action: "accept", bookingId });
  };

  const handleDeclineBooking = (bookingId: string) => {
    setConfirmAction({ show: true, action: "decline", bookingId });
  };

  const confirmStatusAction = async () => {
    if (confirmAction.action && confirmAction.bookingId) {
      await handleStatusUpdate(
        confirmAction.bookingId,
        confirmAction.action === "accept" ? "accepted" : "declined"
      );
    }
    setConfirmAction({ show: false, action: null, bookingId: "" });
  };

  const cancelConfirmAction = () => {
    setConfirmAction({ show: false, action: null, bookingId: "" });
  };

  const handleMeetingSetup = async () => {
    if (!selectedBooking) return;

    try {
      await updateBookingStatus(
        selectedBooking.id,
        "accepted",
        selectedBooking.mode === "online" ? meetingLink : undefined,
        selectedBooking.mode === "offline" ? meetingAddress : undefined
      );

      setShowMeetingModal(false);
      setMeetingLink("");
      setMeetingAddress("");
      setSelectedBooking(null);
    } catch (error) {
      console.error("Failed to setup meeting:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "accepted":
        return "text-green-600 bg-green-100 border-green-200";
      case "declined":
        return "text-red-600 bg-red-100 border-red-200";
      case "completed":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "cancelled":
        return "text-gray-600 bg-gray-100 border-gray-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "declined":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredBookings = displayBookings.filter((booking) => {
    const matchesStatus =
      selectedStatus === "all" || booking.status === selectedStatus;
    const matchesDate =
      !selectedDate || booking.appointment_date === selectedDate;
    return matchesStatus && matchesDate;
  });

  const pendingBookingsCount = displayBookings.filter(
    (b) => b.status === "pending"
  ).length;
  const todayBookingsCount = displayBookings.filter(
    (b) => b.appointment_date === new Date().toISOString().split("T")[0]
  ).length;

  return (
    <div className="space-y-6">
      {/* Status Popup Notification */}
      {statusPopup.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div
            className={`rounded-lg p-4 shadow-lg border ${
              statusPopup.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="font-medium">{statusPopup.message}</span>
              <button
                onClick={() =>
                  setStatusPopup({ show: false, message: "", type: "success" })
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Notification */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Booking Management
          </h2>
          <p className="text-gray-600">
            Manage student counseling appointments
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

          {newBookingNotification && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  New Booking Request
                </p>
                <p className="text-xs text-blue-600">
                  You have new appointment requests to review
                </p>
              </div>
              <button
                onClick={clearNewBookingNotification}
                className="text-blue-600 hover:text-blue-800"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {pendingBookingsCount}
              </p>
              <p className="text-sm text-gray-600">Pending Reviews</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {todayBookingsCount}
              </p>
              <p className="text-sm text-gray-600">Today's Sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {displayBookings.filter((b) => b.status === "accepted").length}
              </p>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {displayBookings.length}
              </p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedStatus("all");
                setSelectedDate("");
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Booking Requests ({filteredBookings.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bookings found matching your filters.
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Student: {booking.student_anon_id.substring(0, 12)}...
                        </h4>
                        <p className="text-sm text-gray-600">
                          Therapist:{" "}
                          {booking.therapist?.name || "Dr. Sarah Johnson"}
                        </p>
                      </div>
                      <span
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(
                            booking.appointment_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{booking.appointment_time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        {booking.mode === "online" ? (
                          <Video className="w-4 h-4 mr-2" />
                        ) : (
                          <MapPin className="w-4 h-4 mr-2" />
                        )}
                        <span className="capitalize">
                          {booking.mode} Session
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Student Notes: </span>
                          {booking.notes}
                        </p>
                      </div>
                    )}

                    {booking.meeting_link && (
                      <div className="flex items-center text-sm text-blue-600 mb-2">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <a
                          href={booking.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}

                    {booking.meeting_address && (
                      <div className="flex items-center text-sm text-green-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{booking.meeting_address}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 ml-4">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAcceptBooking(booking.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineBooking(booking.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === "accepted" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "completed")
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Meeting Setup Modal */}
      {showMeetingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Setup Meeting Details
            </h3>

            <div className="space-y-4">
              {selectedBooking.mode === "online" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/xxx-xxx-xxx"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Address
                  </label>
                  <textarea
                    value={meetingAddress}
                    onChange={(e) => setMeetingAddress(e.target.value)}
                    placeholder="Enter the address for the in-person session"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleMeetingSetup}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Confirm & Accept
              </button>
              <button
                onClick={() => {
                  setShowMeetingModal(false);
                  setMeetingLink("");
                  setMeetingAddress("");
                  setSelectedBooking(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {confirmAction.action === "accept"
                ? "Accept Booking Request"
                : "Decline Booking Request"}
            </h3>

            <p className="text-gray-600 mb-6">
              {confirmAction.action === "accept"
                ? "Are you sure you want to accept this booking request? You will be able to set up meeting details after confirmation."
                : "Are you sure you want to decline this booking request? This action cannot be undone."}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={confirmStatusAction}
                className={`flex-1 py-2 rounded-lg transition ${
                  confirmAction.action === "accept"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {confirmAction.action === "accept"
                  ? "Yes, Accept"
                  : "Yes, Decline"}
              </button>
              <button
                onClick={cancelConfirmAction}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
