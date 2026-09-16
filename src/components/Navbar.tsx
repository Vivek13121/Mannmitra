import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const navigateAndClose = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const links = [
    ["Vent It Out", "/vent-it-out"],
    ["AI Support", "/ai-assistance"],
    ["Booking", "/teletherapy"],
    ["Resources", "/wellness"],
    ["Tools", "/stress-relief"],
    ["Assessment", "/assessment"],
  ];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 px-6 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/image.png" alt="MannMitra Logo" className="h-12 w-12 object-contain" style={{ filter: "brightness(1) contrast(1)", mixBlendMode: "normal" }} />
          <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 dark:from-teal-400 dark:to-blue-400 text-transparent bg-clip-text">MannMitra</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {links.map(([label, path]) => (
            <button key={path} onClick={() => navigate(path)} className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {label}
            </button>
          ))}
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200" aria-label="Toggle dark mode">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/admin" className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm">
            Admin
          </Link>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200" aria-label="Toggle dark mode">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-200" aria-label="Toggle navigation menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 py-4 px-6 absolute top-full left-0 right-0 shadow-md transition-all duration-300">
          <div className="flex flex-col space-y-4">
            {links.map(([label, path]) => (
              <button key={path} onClick={() => navigateAndClose(path)} className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">
                {label}
              </button>
            ))}
            <Link to="/admin" onClick={() => setIsOpen(false)} className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg w-full text-center block">
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
