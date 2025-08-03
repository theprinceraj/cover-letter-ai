import type { PropsWithChildren } from "react";

export const HeroTemplate = ({ children }: PropsWithChildren) => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16">
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
        </section>
    );
};
