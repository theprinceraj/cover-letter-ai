import {
  ChevronDown,
  CreditCard,
  LogIn,
  LogOut,
  User,
  UserCheck2Icon,
} from "lucide-react";
import FullLogo from "../assets/full-logo.webp";
import { useState, useEffect, useContext } from "react";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import GoogleIcon from "../assets/google-icon.svg?react";
import { AuthContext, ModalContext } from "../Contexts";
import { DEFAULT_USE_LIMIT_FOR_GUEST } from "@cover-letter-ai/constants";
import { Dropdown, DropdownItem } from "./ui/Dropdown";

export const Header: React.FC = () => {
  const { isSignInModalOpen, openSignInModal, closeSignInModal } =
    useContext(ModalContext)!;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    login,
    signup,
    loginGuest,
    logout,
    isAuthenticated,
    isLoading,
    user,
    guest,
  } = useContext(AuthContext)!;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      closeSignInModal();
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    }
  };
  const handleGuestLogin = async () => {
    try {
      setError(null);
      await loginGuest();
      closeSignInModal();
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    }
  };

  const handleLogout = async () => {
    logout();
    window.location.reload();
  };

  const getUsesInfo = () => {
    if (user) {
      return `${user.exhaustedUses}/${user.useLimit} uses`;
    }
    if (guest) {
      return `${guest.exhaustedUses}/${guest.useLimit} uses`;
    }
    return "0/0 uses";
  };

  const profileTrigger = (
    <Button variant="secondary">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <User size={16} />
        <span className="hidden sm:inline text-slate-400">
          ({getUsesInfo()})
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </div>
    </Button>
  );

  const handleBuyCredits = () => {
    alert("Buy Credits");
  };

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
            <img src={FullLogo} alt="CoverGenius" className="h-7 md:h-10" />
          </div>

          <nav className="hidden md:flex items-center space-x-6"></nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Dropdown trigger={profileTrigger}>
                  <div className="px-4 py-3 border-b border-slate-600">
                    <div className="text-sm text-slate-400 mb-1">
                      {user ? "Account Credits" : "Guest Credits"}
                    </div>
                    <div className="text-lg font-semibold text-slate-200">
                      {getUsesInfo()} used
                    </div>
                  </div>

                  {user ? (
                    <DropdownItem onClick={handleBuyCredits}>
                      <div className="flex items-center gap-3">
                        <CreditCard size={16} className="text-purple-400" />
                        <span>Buy More Credits</span>
                      </div>
                    </DropdownItem>
                  ) : (
                    <DropdownItem onClick={openSignInModal}>
                      <div className="flex items-center gap-3">
                        <LogIn size={16} className="text-purple-400" />
                        <span>Sign In For More Credits</span>
                      </div>
                    </DropdownItem>
                  )}
                </Dropdown>
                {/* Logout Button */}
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut size={16} className="md:mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={openSignInModal}
                disabled={isLoading}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <Modal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        title={isSignUp ? "Sign Up" : "Sign In"}
      >
        <form className="text-slate-200" onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-4">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <input
              type="email"
              className="p-4 outline-1 outline-slate-200/30 rounded-md"
              placeholder="Email"
              name="email"
              required
            />
            <input
              type="password"
              className="p-4 outline-1 outline-slate-200/30 rounded-md"
              placeholder="Password"
              name="password"
              required
            />
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        <hr className="my-5 text-slate-200/30" />

        <Button
          variant="secondary"
          className="w-full mb-2"
          disabled={isLoading}
        >
          <p className="flex items-center gap-2">
            <span className="text-md">Sign in with Google</span>
            <GoogleIcon className="size-5" />
          </p>
        </Button>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          <p className="flex items-center gap-2">
            <span className="text-md">
              Guest Login ({DEFAULT_USE_LIMIT_FOR_GUEST}{" "}
              {DEFAULT_USE_LIMIT_FOR_GUEST > 1 ? "Uses" : "Use"})
            </span>
            <UserCheck2Icon className="size-5" />
          </p>
        </Button>
      </Modal>
    </>
  );
};
