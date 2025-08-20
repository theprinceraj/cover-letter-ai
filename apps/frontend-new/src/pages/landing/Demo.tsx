import { useState, useCallback, useRef, useEffect } from "react";
import { Play, Pause, RefreshCw, Copy, Check } from "lucide-react";
import Button from "../../components/ui/Button";
import { Layout } from "../../Layout";

const DEMO_STEPS = [
    {
        title: "1. Paste Job Description",
        content: "Software Engineer position at TechCorp requiring React, Node.js, and 3+ years experience...",
    },
    {
        title: "2. AI Analysis",
        content: "✨ Analyzing requirements...\n🎯 Matching your skills...\n📝 Crafting personalized content...",
    },
    {
        title: "3. Generated Cover Letter",
        content: `Dear Hiring Manager,\n\nI am excited to apply for the Software Engineer position at TechCorp. With over 4 years of experience in React and Node.js development, I am confident in my ability to contribute to your innovative team.\n\nIn my previous role at StartupXYZ, I successfully led the development of a scalable web application using React and Node.js, resulting in a 40% increase in user engagement. My expertise in modern JavaScript frameworks aligns perfectly with TechCorp's tech stack.\n\nI am particularly drawn to TechCorp's commitment to cutting-edge technology and would welcome the opportunity to discuss how my skills can drive your projects forward.\n\nThank you for considering my application.\n\nBest regards,\n[Your Name]`,
    },
];

const STEP_DURATION = 2000;

export const Demo: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isCopied, setIsCopied] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        };
    }, []);

    const currentStepData = DEMO_STEPS[currentStep];
    const isAnalysisStep = currentStep === 1;
    const isFinalStep = currentStep === 2;
    const progressPercentage = ((currentStep + 1) / DEMO_STEPS.length) * 100;

    const handlePlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        setIsPlaying(true);
        setCurrentStep(0);

        intervalRef.current = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= DEMO_STEPS.length - 1) {
                    setIsPlaying(false);
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    return prev;
                }
                return prev + 1;
            });
        }, STEP_DURATION);
    }, []);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(DEMO_STEPS[2].content);
            setIsCopied(true);

            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = setTimeout(() => {
                setIsCopied(false);
                copyTimeoutRef.current = null;
            }, 2000);
        } catch (error) {
            console.error("Failed to copy text:", error);
        }
    }, []);

    const handleReset = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setCurrentStep(0);
        setIsPlaying(false);
        setIsCopied(false);
    }, []);

    return (
        <Layout className="bg-primary">
            <div className="max-w-4xl mx-auto py-8">
                <div>
                    <h5 className="text-dark text-xl font-extrabold">AI-powered Cover Letter Assistant</h5>
                    <div className="my-2">
                        <h2 className="font-extrabold text-4xl text-white">Cover Genius</h2>
                        <h3 className="text-3xl font-extrabold">Experience How This Tool Works</h3>
                    </div>
                </div>
                <div className="overflow-hidden bg-white rounded-xl shadow-soft border border-neutral-200 hover:shadow-medium transition-all duration-300 mt-12">
                    {/* Demo Controls */}
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="dark"
                                    IconLucide={isPlaying ? Pause : Play}
                                    onClick={handlePlay}
                                    disabled={isPlaying}>
                                    {isPlaying ? "Playing..." : "Start Demo"}
                                </Button>
                                <Button variant="dark" onClick={handleReset} IconLucide={RefreshCw}>
                                    Reset
                                </Button>
                            </div>

                            <div className="text-dark text-sm">
                                Step {currentStep + 1} of {DEMO_STEPS.length}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-neutral-100 h-2">
                        <div
                            className="bg-dark h-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    {/* Demo Content */}
                    <div className="p-5 md:p-8">
                        <div className="mb-6">
                            <h4 className="text-xl font-medium text-neutral-800">{currentStepData.title}</h4>
                        </div>

                        <div className="bg-neutral-50 rounded-lg p-6 min-h-[300px] relative">
                            {isAnalysisStep ? (
                                <div className="space-y-4">
                                    {currentStepData.content.split("\n").map((line, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className="size-2 bg-orange-500 rounded-full animate-pulse" />
                                            <span>{line}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="font-mono whitespace-pre-wrap">{currentStepData.content}</div>
                            )}

                            {isFinalStep && (
                                <Button
                                    variant="dark"
                                    IconLucide={isCopied ? Check : Copy}
                                    size="sm"
                                    className="absolute top-4 right-4 flex items-center gap-2"
                                    onClick={handleCopy}>
                                    <span className="hidden md:inline">{isCopied ? "Copied!" : "Copy"}</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
