import { Layout } from "../../Layout";
import { Demo } from "./Demo";
import { HeroSection } from "./HeroSection";

export const Landing: React.FC = () => {
    return (
        <Layout className="bg-amber-200/40">
            <div className="w-full">
                <HeroSection />
                <Demo />
            </div>
        </Layout>
    );
};
