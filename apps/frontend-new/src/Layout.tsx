import type { PropsWithChildren } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const Layout: React.FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
    return (
        <div className={`text-black ${className}`}>
            <Header />
            <main className="min-h-[95vh] px-4 md:px-16 lg:px-32 py-4 lg:py-24 flex flex-col items-center">
                <div className="w-full">{children}</div>
            </main>
            <Footer />
        </div>
    );
};
