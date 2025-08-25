import { MenuIcon, UserIcon, XIcon } from "lucide-react";
import Button from "./ui/Button";
import { useCallback, useContext, useState } from "react";
import { FRONTEND_ENDPOINTS } from "../constants";
import { toast } from "sonner";
import { Link, useLocation, useNavigate, type Location, type NavigateFunction } from "react-router";
import { AuthContext, GlobalContext } from "../Contexts";
import type { UseAuthReturn } from "../hooks/useAuth";

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthContext)!;
    const { openOnboardModal } = useContext(GlobalContext)!;

    return (
        <header className="sticky z-10 top-6 left-0 right-0 mx-auto w-11/12 py-5 px-10 flex items-center justify-between bg-white rounded-full shadow-md">
            <Link to={auth.user || auth.guest ? FRONTEND_ENDPOINTS.GENERATOR : FRONTEND_ENDPOINTS.LANDING}>
                <h2 className="font-extrabold text-xl italic">
                    Cover<span className="text-primary underline underline-offset-4">Genius</span>
                </h2>
            </Link>
            {auth.isAuthenticated ? (
                <MenuButton navigate={navigate} location={location} auth={auth} />
            ) : (
                <Button size="md" variant="white" onClick={openOnboardModal}>
                    Join
                </Button>
            )}
        </header>
    );
};

const MenuButton: React.FC<{ navigate: NavigateFunction; location: Location; auth: UseAuthReturn }> = ({
    navigate,
    location,
    auth,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenuVisibility = useCallback(() => {
        setIsOpen(!isOpen);
    }, [setIsOpen, isOpen]);

    return (
        <button onClick={toggleMenuVisibility}>
            <button className="cursor-pointer">{isOpen ? <XIcon /> : <MenuIcon />}</button>

            {isOpen && (
                <MobileMenu navigate={navigate} isOpen={isOpen} setIsOpen={setIsOpen} location={location} auth={auth} />
            )}
        </button>
    );
};

const MobileMenu: React.FC<{
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    navigate: NavigateFunction;
    location: Location;
    auth: UseAuthReturn;
}> = ({ isOpen, setIsOpen, navigate, location, auth }) => {
    const handleLogout = useCallback(async () => {
        auth.logout();
        navigate("/");
        toast.success("Logged out successfully");
    }, [auth, navigate]);

    const getUsesInfo = useCallback(() => {
        if (auth.user) {
            return `${auth.user.exhaustedUses}/${auth.user.useLimit}`;
        }
        if (auth.guest) {
            return `${auth.guest.exhaustedUses}/${auth.guest.useLimit}`;
        }
        return "0/0";
    }, [auth]);

    const handleBuyCreditsButtonClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            setIsOpen(false);
            if (location.pathname !== FRONTEND_ENDPOINTS.CREDITS_SHOP) {
                navigate(FRONTEND_ENDPOINTS.CREDITS_SHOP);
            } else toast.warning("You are already on the Credits Shop");
        },
        [location.pathname, setIsOpen, navigate]
    );

    return (
        <div
            className={`absolute z-50 top-20 right-[50%] translate-x-[50%] md:right-[5%] md:-translate-x-0 lg:right-[2%] bg-white w-[80vw] md:w-[33vw] lg:w-[25vw] rounded-xl p-6 flex flex-col space-y-4 items-center justify-center transition-all duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            <div className="flex justify-center items-center space-x-5 md:space-x-3">
                <div className="bg-primary/30 rounded-full p-4 md:p-2">
                    <UserIcon className="size-6 md:size-7" />
                </div>
                <div className="text-left">
                    <div className="text-md text-slate-800 mb-1">
                        {auth.user ? "Account Credits:" : "Guest Credits:"}
                    </div>
                    <div className="text-lg font-semibold">{getUsesInfo()} credits used</div>
                </div>
            </div>
            <hr className="text-dark/10 w-full" />
            <div className="flex w-full justify-end">
                <div className="flex flex-col items-end space-y-4">
                    <Button variant="white" onClick={handleBuyCreditsButtonClick}>
                        Buy Credits
                    </Button>
                    <Button variant="dark" className="bg-red-700" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};
