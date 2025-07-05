import { Sparkles, UserCheck2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { useModal } from "../hooks/useModal";
import { Modal } from "./ui/Modal";
import GoogleIcon from "../assets/google-icon.svg?react";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const signInModal = useModal();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
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
            <Button onClick={signInModal.openModal} variant="primary">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <Modal
        isOpen={signInModal.isOpen}
        onClose={signInModal.closeModal}
        title="Sign In"
      >
        <form className="text-slate-200">
          <div className="flex flex-col gap-4">
            <input
              type="email"
              className="p-4 outline-1 outline-slate-200/30 rounded-md"
              placeholder="Email"
            />
            <input
              type="password"
              className="p-4 outline-1 outline-slate-200/30 rounded-md"
              placeholder="Password"
            />
            <Button variant="primary">Sign In</Button>
          </div>
        </form>
        <hr className="my-5 text-slate-200/30" />
        <Button variant="secondary" className="w-full mb-2">
          <p className="flex items-center gap-2">
            <span className="text-md">Sign in with Google</span>
            <GoogleIcon className="size-5" />
          </p>
        </Button>
        <Button variant="secondary" className="w-full">
          <p className="flex items-center gap-2">
            <span className="text-md">Guest Login (1 Use)</span>
            <UserCheck2Icon className="size-5" />
          </p>
        </Button>
      </Modal>
    </>
  );
};
