import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useAuthStore } from "./lib/auth-store";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import EBAT from "./pages/EBAT";
import AIAssistance from "./pages/AIAssistance";
import Teletherapy from "./pages/Teletherapy";
import StressRelief from "./pages/StressRelief";
import Wellness from "./pages/Wellness";
import MentalHealthAssessment from "./pages/MentalHealthAssessment";
import VentItOut from "./pages/VentItOut";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";

function App() {
  const { initialize } = useAuthStore();
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth store
    initialize();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 dark:text-white transition-colors duration-300">
        <Navbar session={session} onShowAuth={() => setShowAuthModal(true)} />
        <Routes>
          <Route
            path="/"
            element={<Home onShowAuth={() => setShowAuthModal(true)} />}
          />
          <Route
            path="/ebat"
            element={
              <ProtectedRoute
                onShowAuth={() => setShowAuthModal(true)}
                featureName="EBAT Assessment"
              >
                <EBAT />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-assistance"
            element={
              <ProtectedRoute
                onShowAuth={() => setShowAuthModal(true)}
                featureName="AI Assistance"
              >
                <AIAssistance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teletherapy"
            element={
              <ProtectedRoute
                onShowAuth={() => setShowAuthModal(true)}
                featureName="Teletherapy"
              >
                <Teletherapy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stress-relief"
            element={
              <ProtectedRoute
                onShowAuth={() => setShowAuthModal(true)}
                featureName="Stress Relief Tools"
              >
                <StressRelief />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wellness/*"
            element={
              <ProtectedRoute
                onShowAuth={() => setShowAuthModal(true)}
                featureName="Wellness Center"
              >
                <Wellness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute
                onShowAuth={() => setShowAuthModal(true)}
                featureName="Mental Health Assessment"
              >
                <MentalHealthAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vent-it-out"
            element={
              <ProtectedRoute
                onShowAuth={() => setShowAuthModal(true)}
                featureName="Vent It Out"
              >
                <VentItOut />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />

        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
