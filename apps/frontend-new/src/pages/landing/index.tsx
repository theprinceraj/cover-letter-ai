import { Demo } from "./Demo";
import { Features } from "./Features";
import { HeroSection } from "./HeroSection";

export const Landing: React.FC = () => {
    return (
        <>
            <HeroSection />
            <Demo />
            <Features />
        </>
    );
};
