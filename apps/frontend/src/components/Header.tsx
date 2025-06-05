import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8
        transition-all duration-300 ease-in-out
        ${isScrolled ? "py-3 bg-slate-900/95 backdrop-blur-sm shadow-md" : "py-5 bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center text-purple-500 mr-2">
            <Sparkles size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            CoverGenius
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6"></nav>

        <div className="flex items-center">
          <a
            href="#"
            className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Sign In
          </a>
        </div>
      </div>
    </header>
  );
};
