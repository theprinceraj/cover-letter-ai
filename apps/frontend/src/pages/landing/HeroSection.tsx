import HeroTemplate from "../../components/ui/HeroTemplate";
import HeroVectorImg from "../../assets/hero-vector.png";
import { Pill } from "../../components/ui/Pill";
import Button from "../../components/ui/Button";
import { useContext } from "react";
import { GlobalContext } from "../../Contexts";
import { Layout } from "../../Layout";

const pills = ["Cursus Integer", "Integer Consequat", "Aliquot Tristique", "Mauris Fermentum Prasaent"];

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
                            <h5 className="text-primary text-xl font-extrabold">RISUS PRAESENT VULPUTATE.</h5>
                            <div className="my-2">
                                <h2 className="font-extrabold text-4xl">Cursus Integer</h2>
                                <h3 className="text-3xl font-extrabold">Consequat Tristique.</h3>
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
