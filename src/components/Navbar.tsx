import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, User, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase"; // Using real Supabase
import { useAuthStore } from "../lib/auth-store";

interface NavbarProps {
  session: any;
  onShowAuth: () => void;
}

const Navbar = ({ session, onShowAuth }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleAuthenticatedNavigation = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      onShowAuth();
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 px-6 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/image.png"
            alt="MannMitra Logo"
            className="h-12 w-12 object-contain"
            style={{
              filter: "brightness(1) contrast(1)",
              mixBlendMode: "normal",
            }}
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 dark:from-teal-400 dark:to-blue-400 text-transparent bg-clip-text">
            MannMitra
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleAuthenticatedNavigation("/vent-it-out")}
            className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Vent It Out
          </button>
          <button
            onClick={() => handleAuthenticatedNavigation("/ai-assistance")}
            className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            AI Support
          </button>
          <button
            onClick={() => handleAuthenticatedNavigation("/teletherapy")}
            className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Booking
          </button>
          <button
            onClick={() => handleAuthenticatedNavigation("/wellness")}
            className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Resources
          </button>
          <button
            onClick={() => handleAuthenticatedNavigation("/stress-relief")}
            className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Tools
          </button>
          <button
            onClick={() => handleAuthenticatedNavigation("/assessment")}
            className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Assessment
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          {session ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-full">
                <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                  {session.user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                title="Sign Out"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/admin"
                className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                Admin
              </Link>
              <button
                onClick={onShowAuth}
                className="bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-500 hover:to-blue-400 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="text-gray-700 dark:text-gray-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 py-4 px-6 absolute top-full left-0 right-0 shadow-md transition-all duration-300">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => {
                handleAuthenticatedNavigation("/vent-it-out");
                setIsOpen(false);
              }}
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
            >
              Vent It Out
            </button>
            <button
              onClick={() => {
                handleAuthenticatedNavigation("/ai-assistance");
                setIsOpen(false);
              }}
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
            >
              AI Support
            </button>
            <button
              onClick={() => {
                handleAuthenticatedNavigation("/teletherapy");
                setIsOpen(false);
              }}
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
            >
              Booking
            </button>
            <button
              onClick={() => {
                handleAuthenticatedNavigation("/wellness");
                setIsOpen(false);
              }}
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
            >
              Resources
            </button>
            <button
              onClick={() => {
                handleAuthenticatedNavigation("/stress-relief");
                setIsOpen(false);
              }}
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
            >
              Tools
            </button>
            <button
              onClick={() => {
                handleAuthenticatedNavigation("/assessment");
                setIsOpen(false);
              }}
              className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
            >
              Assessment
            </button>
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-full">
                  <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                    {session.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg w-full"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/admin"
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg w-full text-center block"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    onShowAuth();
                    setIsOpen(false);
                  }}
                  className="bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-500 hover:to-blue-400 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg w-full text-center"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
