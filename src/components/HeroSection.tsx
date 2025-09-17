import { useEffect, useRef } from "react";
import { Brain, Heart, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/auth-store";

interface HeroSectionProps {
  onShowAuth: () => void;
}

const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const elements = heroRef.current.querySelectorAll(".floating-element");

      elements.forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.speed || "0.05");
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;

        (
          el as HTMLElement
        ).style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleGetStarted = () => {
    if (user) {
      // User is authenticated, proceed to assessment
      navigate("/assessment");
    } else {
      // User not authenticated, show auth modal
      onShowAuth();
    }
  };

  const handleLearnMore = () => {
    // Direct navigation - no authentication required
    navigate("/ai-assistance");
  };

  return (
    <div
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 pt-20 pb-32 px-6 transition-colors duration-300"
    >
      {/* 3D Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="floating-element"
          data-speed="0.03"
          style={{ position: "absolute", top: "15%", left: "10%" }}
        >
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-teal-500/10 dark:bg-teal-500/20 backdrop-blur-md"></div>
        </div>
        <div
          className="floating-element"
          data-speed="0.05"
          style={{ position: "absolute", top: "60%", left: "15%" }}
        >
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-md"></div>
        </div>
        <div
          className="floating-element"
          data-speed="0.07"
          style={{ position: "absolute", top: "30%", right: "15%" }}
        >
          <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-purple-500/10 dark:bg-purple-500/20 backdrop-blur-md"></div>
        </div>
        <div
          className="floating-element"
          data-speed="0.04"
          style={{ position: "absolute", top: "70%", right: "10%" }}
        >
          <div className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20 backdrop-blur-md"></div>
        </div>

        {/* 3D Objects */}
        <div
          className="floating-element"
          data-speed="0.06"
          style={{ position: "absolute", top: "20%", right: "30%" }}
        >
          <Brain className="w-12 h-12 md:w-16 md:h-16 text-teal-500/40 dark:text-teal-400/40" />
        </div>
        <div
          className="floating-element"
          data-speed="0.08"
          style={{ position: "absolute", bottom: "30%", left: "25%" }}
        >
          <Heart className="w-10 h-10 md:w-14 md:h-14 text-pink-500/40 dark:text-pink-400/40" />
        </div>
        <div
          className="floating-element"
          data-speed="0.04"
          style={{ position: "absolute", top: "60%", right: "20%" }}
        >
          <Shield className="w-12 h-12 md:w-16 md:h-16 text-blue-500/40 dark:text-blue-400/40" />
        </div>
        <div
          className="floating-element"
          data-speed="0.07"
          style={{ position: "absolute", top: "40%", left: "20%" }}
        >
          <Sparkles className="w-10 h-10 md:w-14 md:h-14 text-yellow-500/40 dark:text-yellow-400/40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 text-transparent bg-clip-text">
                Digital Psychological Intervention
              </span>
              <br />
              <span className="text-gray-800 dark:text-white">
                System for College Students
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              MannMitra addresses mental health challenges in higher education
              with AI-guided support, confidential counseling, and data-driven
              interventions
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-500 hover:to-blue-400 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-center"
              >
                Get Started Free
              </button>
              <button
                onClick={handleLearnMore}
                className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg text-center"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full h-[400px] md:h-[500px] bg-black rounded-2xl overflow-hidden shadow-xl">
              <video
                src="/Calming_Futuristic_AI_Brain_Animation.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="object-cover w-full h-full"
                aria-label="Calming futuristic AI brain animation for mental wellness"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Floating cards */}
            <div
              className="floating-element absolute -top-6 -left-6 md:-top-10 md:-left-10 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg"
              data-speed="0.05"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    AI Analysis
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Real-time emotional insights
                  </p>
                </div>
              </div>
            </div>

            <div
              className="floating-element absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg"
              data-speed="0.07"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    Emotion-Aware Venting
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Express & Analyze
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
