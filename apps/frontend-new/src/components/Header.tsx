import { MenuIcon } from "lucide-react";

export const Header: React.FC = () => {
    return (
        <header className="sticky top-6 left-0 right-0 mx-auto w-11/12 py-5 px-10 flex items-center justify-between bg-white rounded-full">
            <h2 className="font-extrabold text-xl italic">
                Cover<span className="text-primary underline underline-offset-4">Genius</span>
            </h2>
            <button className="cursor-pointer">
                <MenuIcon />
            </button>
        </header>
    );
};
