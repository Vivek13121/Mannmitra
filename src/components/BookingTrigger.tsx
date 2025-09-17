import React from "react";
import { Calendar, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingTriggerProps {
  triggerType?: "crisis" | "regular";
  className?: string;
}

const BookingTrigger: React.FC<BookingTriggerProps> = ({
  triggerType = "regular",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/teletherapy");
  };

  if (triggerType === "crisis") {
    return (
      <div
        className={`bg-orange-50 border border-orange-200 rounded-lg p-6 ${className}`}
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Consider Professional Support
            </h3>
            <p className="text-orange-700 mb-4">
              Based on your responses, it might be helpful to speak with a
              qualified therapist. Our platform connects you with licensed
              mental health professionals who can provide personalized support.
            </p>
            <div className="flex items-center space-x-4 text-sm text-orange-600 mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Flexible scheduling</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Available today</span>
              </div>
            </div>
            <button
              onClick={handleBookNow}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Book a Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Ready to Talk to Someone?
          </h3>
          <p className="text-purple-100 mb-4">
            Connect with qualified therapists who understand student mental
            health
          </p>
          <button
            onClick={handleBookNow}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition font-medium"
          >
            Book a Session
          </button>
        </div>
        <div className="hidden md:block">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTrigger;
