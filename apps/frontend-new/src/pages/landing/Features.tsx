import { Brain, CreditCard, FileText, Lightbulb, ShieldCheck, Zap } from "lucide-react";
import { Layout } from "../../Layout";
import { Box } from "../../components/ui/Box";

const features = [
    {
        icon: Brain,
        title: "AI-Powered Generation",
        description: "Leverage AI to create professional cover letters tailored to your job description and resume.",
        color: "bg-primary-500",
        hoverClass: "hover:bg-primary-500",
    },
    {
        icon: FileText,
        title: "Resume Integration",
        description: "Upload your PDF resume for automatic analysis and incorporation of your experience and skills.",
        color: "bg-orange-500",
        hoverClass: "hover:bg-orange-500",
    },
    {
        icon: Zap,
        title: "Fast & Personalized",
        description: "Generate customized cover letters in seconds, perfectly matched to job requirements.",
        color: "bg-purple-500",
        hoverClass: "hover:bg-purple-500",
    },
    {
        icon: Lightbulb,
        title: "Smart Suggestions",
        description: "Receive AI-generated enhancement suggestions to make your cover letter even stronger.",
        color: "bg-green-500",
        hoverClass: "hover:bg-green-500",
    },
    {
        icon: CreditCard,
        title: "Flexible Credits",
        description: "Use our credit system for generations, with options for guests and premium packages.",
        color: "bg-primary-600",
        hoverClass: "hover:bg-primary-600",
    },
    {
        icon: ShieldCheck,
        title: "Secure Access",
        description: "Protected authentication with email verification and guest modes for easy starting.",
        color: "bg-orange-600",
        hoverClass: "hover:bg-orange-600",
    },
];

export const Features: React.FC = () => {
    return (
        <Layout className="bg-dark text-white">
            <div className="mt-10">
                <h5 className="text-primary text-xl font-extrabold">POWERFUL FEATURES THAT GET RESULTS.</h5>
                <div className="my-2">
                    <h2 className="font-extrabold text-4xl">Compelling Cover Letters &rarr; Interviews</h2>
                </div>
            </div>
            <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feat, index) => (
                    <Box
                        heading={feat.title}
                        IconLucide={feat.icon}
                        sh={feat.description}
                        order={index + 1}
                        key={index + 1}
                        variant={index % 2 == 0 ? "dark" : "white"}
                    />
                ))}
            </div>
        </Layout>
    );
};
