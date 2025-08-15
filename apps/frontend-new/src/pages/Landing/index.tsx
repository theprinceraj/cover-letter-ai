import { Layout } from "../../Layout";
import { HeroSection } from "./HeroSection";

export const Landing: React.FC = () => {
    return (
        <Layout className="bg-amber-200/80">
            <div className="w-full">
                <HeroSection />
            </div>
        </Layout>
    );
};
