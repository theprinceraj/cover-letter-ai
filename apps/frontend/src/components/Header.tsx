import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import {
  Menu,
  X,
  PenTool,
  User,
  ChevronDown,
  LogOut,
  CreditCard,
} from "lucide-react";
import { Button } from "./ui/Button";
import {
  Link,
  type Location,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { FRONTEND_ENDPOINTS } from "../constants";
import { AuthContext, ModalContext } from "../Contexts";
import { toast } from "sonner";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, user, guest } = useContext(AuthContext)!;
  const { openSignInModal } = useContext(ModalContext)!;
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  const handleLogout = useCallback(async () => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const getUsesInfo = useCallback(() => {
    if (user) {
      return `${user.exhaustedUses}/${user.useLimit} credits`;
    }
    if (guest) {
      return `${guest.exhaustedUses}/${guest.useLimit} credits`;
    }
    return "0/0 uses";
  }, [user, guest]);

  const handleMobileMenuButtonClick = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-strong" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link
            to={
              user || guest
                ? FRONTEND_ENDPOINTS.GENERATOR
                : FRONTEND_ENDPOINTS.LANDING
            }
            className="flex items-center space-x-2"
          >
            <div className="bg-primary-500 p-2 rounded-lg shadow-soft">
              <PenTool className="size-5 lg:size-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-500">
              CoverGenius
            </span>
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <DesktopNavigation
            location={location}
            isAuthenticated={isAuthenticated}
            openSignInModal={openSignInModal}
            handleLogout={handleLogout}
            user={user}
            getUsesInfo={getUsesInfo}
          />

          {/* Mobile Menu Button - hidden on desktop */}
          <button
            ref={mobileMenuButtonRef}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-primary-100 transition-colors"
            onClick={handleMobileMenuButtonClick}
          >
            {isMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu - hidden on desktop */}
        {isMenuOpen && (
          <MobileNavigation
            ref={mobileMenuRef as React.RefObject<HTMLDivElement>}
            location={location}
            isAuthenticated={isAuthenticated}
            openSignInModal={openSignInModal}
            handleLogout={handleLogout}
            user={user}
            navigate={navigate}
            setIsMenuOpen={setIsMenuOpen}
            getUsesInfo={getUsesInfo}
          />
        )}
      </div>
    </header>
  );
};

const DesktopNavigation = ({
  location,
  isAuthenticated,
  openSignInModal,
  handleLogout,
  user,
  getUsesInfo,
}: {
  location: Location;
  isAuthenticated: boolean;
  openSignInModal: () => void;
  handleLogout: () => void;
  user: any | undefined;
  getUsesInfo: () => string;
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isProfileDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isProfileDropdownOpen]);

  const handleBuyCredits = useCallback(() => {
    setIsProfileDropdownOpen(false);
    if (location.pathname !== FRONTEND_ENDPOINTS.CREDITS_SHOP) {
      navigate(FRONTEND_ENDPOINTS.CREDITS_SHOP);
    } else {
      toast.warning("You are already on the Credits Shop");
    }
  }, [location.pathname, navigate]);

  const profileDropdown = (
    <div
      ref={dropdownRef}
      className="absolute top-14 right-24 lg:left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-3 px-4 z-50 animate-fade-in duration-150"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-primary-100 rounded-full p-2">
          <User className="size-5 text-primary-500" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">
            {user ? "Account Credits" : "Guest Credits"}
          </div>
          <div className="text-lg font-bold text-slate-800">
            {getUsesInfo()}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          size="sm"
          className="flex items-center gap-2 justify-center"
          onClick={handleBuyCredits}
        >
          <CreditCard className="size-5" />
          <span>Buy More Credits</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {location.pathname === FRONTEND_ENDPOINTS.LANDING && (
        <nav className="hidden md:flex md:space-x-2 lg:space-x-8">
          <a href="#features" className="btn-ghost">
            Features
          </a>
          <a href="#demo" className="btn-ghost">
            Demo
          </a>
          <a href="#pricing" className="btn-ghost">
            Pricing
          </a>
          <a href="#testimonials" className="btn-ghost">
            Reviews
          </a>
        </nav>
      )}
      <div className="hidden md:flex items-center space-x-4 relative">
        {isAuthenticated && isProfileDropdownOpen && profileDropdown}
        {isAuthenticated ? (
          <>
            <Button
              ref={buttonRef as React.RefObject<HTMLButtonElement>}
              variant="primary"
              size="sm"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className={`flex items-center gap-2 ${isProfileDropdownOpen ? "bg-primary-100 text-primary-600" : ""}`}
            >
              <User className="size-5" />
              <span className="hidden lg:inline text-md text-white font-medium">
                {getUsesInfo()}
              </span>
              <ChevronDown
                className={`size-4 transition-transform duration-300 ml-2 lg:ml-3 ${
                  isProfileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red-500 hover:bg-red-600"
              onClick={handleLogout}
            >
              <LogOut className="size-5 mr-2 text-white" />
              <span className="inline">Logout</span>
            </Button>
          </>
        ) : (
          <Button variant="primary" size="sm" onClick={openSignInModal}>
            Start Now
          </Button>
        )}
      </div>
    </>
  );
};

const MobileNavigation = ({
  ref,
  location,
  isAuthenticated,
  openSignInModal,
  handleLogout,
  user,
  navigate,
  setIsMenuOpen,
  getUsesInfo,
}: {
  ref: React.RefObject<HTMLDivElement>;
  location: Location;
  isAuthenticated: boolean;
  openSignInModal: () => void;
  handleLogout: () => void;
  user: any | undefined;
  navigate: (path: string) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  getUsesInfo: () => string;
}) => {
  const handleBuyCreditsButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setIsMenuOpen(false);
      if (location.pathname !== FRONTEND_ENDPOINTS.CREDITS_SHOP) {
        navigate(FRONTEND_ENDPOINTS.CREDITS_SHOP);
      } else {
        toast.warning("You are already on the Credits Shop");
      }
    },
    [location.pathname, navigate, setIsMenuOpen]
  );

  return (
    <div
      ref={ref}
      className="md:hidden bg-white border-t border-neutral-200 py-4 px-2"
    >
      {location.pathname === FRONTEND_ENDPOINTS.LANDING && (
        <nav className="flex flex-col space-y-4 border-b border-neutral-200 pb-2">
          <a href="#features" className="btn-ghost text-left">
            Features
          </a>
          <a href="#demo" className="btn-ghost text-left">
            Demo
          </a>
          <a href="#pricing" className="btn-ghost text-left">
            Pricing
          </a>
          <a href="#testimonials" className="btn-ghost text-left">
            Reviews
          </a>
        </nav>
      )}
      <div className="flex flex-col space-y-2 pt-4 px-4">
        {isAuthenticated ? (
          <div className="flex flex-col space-y-4">
            {/* Information About Credits */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 rounded-full p-2">
                <User className="size-5 text-primary-500" />
              </div>
              <div>
                <div className="text-md text-slate-800 mb-1">
                  {user ? "Account Credits:" : "Guest Credits:"}
                </div>
                <div className="text-lg font-semibold text-slate-600">
                  {getUsesInfo()} used
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                className="bg-primary-500 hover:bg-primary-600 w-full flex items-center gap-2 justify-center"
                onClick={handleBuyCreditsButtonClick}
              >
                <CreditCard className="size-4" />
                Buy Credits
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-red-500 hover:bg-red-600 w-full flex items-center gap-2 justify-center text-white"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={openSignInModal}
          >
            Start Now
          </Button>
        )}
      </div>
    </div>
  );
};
