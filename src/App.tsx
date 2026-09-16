import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
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
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 dark:text-white transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ebat" element={<EBAT />} />
          <Route path="/ai-assistance" element={<AIAssistance />} />
          <Route path="/teletherapy" element={<Teletherapy />} />
          <Route path="/stress-relief" element={<StressRelief />} />
          <Route path="/wellness/*" element={<Wellness />} />
          <Route path="/assessment" element={<MentalHealthAssessment />} />
          <Route path="/vent-it-out" element={<VentItOut />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
