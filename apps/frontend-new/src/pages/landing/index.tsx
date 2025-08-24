import { Demo } from "./Demo";
import { FaqPage } from "./FaqPage";
import { Features } from "./Features";
import { HeroSection } from "./HeroSection";
import { Testimonial } from "./Testimonial";

export const Landing: React.FC = () => {
    return (
        <>
            <HeroSection />
            <Demo />
            <Features />
            <Testimonial />
            <FaqPage />
        </>
    );
};
