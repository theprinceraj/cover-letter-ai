import HeroTemplate from "../../components/ui/HeroTemplate";
import HeroVectorImg from "../../assets/hero-vector.webp";
import { Pill } from "../../components/ui/Pill";
import Button from "../../components/ui/Button";
import { useContext } from "react";
import { GlobalContext } from "../../Contexts";
import { Layout } from "../../Layout";

const pills = ["AI-Powered Writing", "Personalized Content", "Job-Matched Content", "Quick & Professional"];

export const HeroSection: React.FC = () => {
    const { openOnboardModal } = useContext(GlobalContext)!;
    return (
        <Layout className="bg-amber-200/40" hasHeader>
            <HeroTemplate>
                <div className="lg:flex lg:gap-10 lg:flex-row-reverse lg:items-center">
                    <div>
                        <img src={HeroVectorImg} alt="A vector image of girl working" />
                    </div>
                    <div className="lg:w-2/3">
                        <div>
                            <h5 className="text-primary text-xl font-extrabold">AI-POWERED CAREER TOOL</h5>
                            <div className="my-2">
                                <h2 className="font-extrabold text-4xl">Create Perfect</h2>
                                <h3 className="text-3xl font-extrabold">Cover Letters in Minutes</h3>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row flex-wrap space-x-2 space-y-4 mt-8">
                            {pills.map((pill) => (
                                <Pill key={pill} text={pill} variant="yellow" />
                            ))}
                        </div>
                        <div className="mt-8">
                            <Button variant="yellow" onClick={openOnboardModal}>
                                Try Now
                            </Button>
                        </div>
                    </div>
                </div>
            </HeroTemplate>
        </Layout>
    );
};
