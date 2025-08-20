import type { PropsWithChildren } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const Layout: React.FC<PropsWithChildren<{ className?: string; hasHeader?: boolean; hasFooter?: boolean }>> = ({
    children,
    className,
    hasHeader = false,
    hasFooter = false,
}) => {
    const containerClasses = `min-h-[95vh] flex flex-col items-center px-4 md:px-16 lg:px-32 py-4 lg:py-24`;
    return (
        <div className={`text-black ${className}`}>
            {hasHeader && <Header />}
            <main className={containerClasses}>
                <div className="w-full">{children}</div>
            </main>
            {hasFooter && <Footer />}
        </div>
    );
};
