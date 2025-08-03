import { useState, useCallback, useMemo, memo, useRef, useEffect } from "react";
import { Play, Pause, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { LandingSectionTemplate } from "../ui/LandingSectionTemplate";

// Move static data outside component to prevent recreation
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
] as const;

const STEP_DURATION = 2000;

// Memoized title component
const DemoTitle = memo(() => (
    <>
        <span className="text-neutral-800">See </span>
        <span className="text-orange-500">CoverGenius</span>
        <span className="text-neutral-800"> in Action</span>
    </>
));

DemoTitle.displayName = "DemoTitle";

// Memoized demo content component
const DemoContent = memo(
    ({
        content,
        isAnalysisStep,
        isFinalStep,
        onCopy,
        isCopied,
    }: {
        content: string;
        isAnalysisStep: boolean;
        isFinalStep: boolean;
        onCopy: () => void;
        isCopied: boolean;
    }) => {
        const contentLines = useMemo(() => (isAnalysisStep ? content.split("\n") : null), [content, isAnalysisStep]);

        return (
            <div className="bg-neutral-50 rounded-lg p-6 min-h-[300px] relative">
                {isAnalysisStep ? (
                    <div className="space-y-4">
                        {contentLines?.map((line, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                <span className="text-secondary-700">{line}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="font-mono text-secondary-700 whitespace-pre-wrap">{content}</div>
                )}

                {isFinalStep && (
                    <Button
                        variant="primary"
                        size="sm"
                        className="absolute top-4 right-4 flex items-center gap-2"
                        onClick={onCopy}>
                        {isCopied ? (
                            <>
                                <Check className="size-4" />
                                <span className="hidden md:inline">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="size-4" />
                                <span className="hidden md:inline">Copy</span>
                            </>
                        )}
                    </Button>
                )}
            </div>
        );
    }
);

DemoContent.displayName = "DemoContent";

export const CoverGeniusDemo: React.FC = memo(() => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isCopied, setIsCopied] = useState(false);

    // Use ref to store interval ID for proper cleanup
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup intervals on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    // Memoized step information
    const currentStepInfo = useMemo(
        () => ({
            ...DEMO_STEPS[currentStep],
            isAnalysisStep: currentStep === 1,
            isFinalStep: currentStep === 2,
        }),
        [currentStep]
    );

    // Memoized progress calculation
    const progressPercentage = useMemo(() => ((currentStep + 1) / DEMO_STEPS.length) * 100, [currentStep]);

    // Memoized styles
    const progressStyle = useMemo(
        () => ({
            width: `${progressPercentage}%`,
        }),
        [progressPercentage]
    );

    const handlePlay = useCallback(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

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

            // Clear existing timeout
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }

            copyTimeoutRef.current = setTimeout(() => {
                setIsCopied(false);
                copyTimeoutRef.current = null;
            }, 2000);
        } catch (error) {
            console.error("Failed to copy text:", error);
            // Fallback: You could show a toast or error message here
        }
    }, []);

    const handleReset = useCallback(() => {
        // Clear interval if playing
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setCurrentStep(0);
        setIsPlaying(false);
        setIsCopied(false);
    }, []);

    // Memoized static props
    const sectionProps = useMemo(
        () => ({
            title: <DemoTitle />,
            description: "Watch how our AI tool transforms a resume into a personalized cover letter",
            id: "demo",
            bgClasses: "bg-neutral-50",
        }),
        []
    );

    // Memoized button props
    const playButtonProps = useMemo(
        () => ({
            onClick: handlePlay,
            disabled: isPlaying,
            className:
                "bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all disabled:opacity-50 focus:ring-2 focus:ring-white/50",
        }),
        [handlePlay, isPlaying]
    );

    const resetButtonProps = useMemo(
        () => ({
            onClick: handleReset,
            className:
                "bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all focus:ring-2 focus:ring-white/50",
        }),
        [handleReset]
    );

    return (
        <LandingSectionTemplate {...sectionProps}>
            <div className="max-w-4xl mx-auto">
                <div className="card overflow-hidden">
                    {/* Demo Controls */}
                    <div className="bg-purple-500 p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <button {...playButtonProps}>
                                    {isPlaying ? (
                                        <>
                                            <Pause className="size-4" />
                                            <span>Playing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="size-4" />
                                            <span>Start Demo</span>
                                        </>
                                    )}
                                </button>
                                <button {...resetButtonProps}>
                                    <RefreshCw className="size-4" />
                                    <span>Reset</span>
                                </button>
                            </div>

                            <div className="text-white text-sm">
                                Step {currentStep + 1} of {DEMO_STEPS.length}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-neutral-100 h-2">
                        <div className="bg-green-500 h-full transition-all duration-500" style={progressStyle} />
                    </div>

                    {/* Demo Content */}
                    <div className="p-5 md:p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-semibold mb-2 text-neutral-800">{currentStepInfo.title}</h3>
                        </div>

                        <DemoContent
                            content={currentStepInfo.content}
                            isAnalysisStep={currentStepInfo.isAnalysisStep}
                            isFinalStep={currentStepInfo.isFinalStep}
                            onCopy={handleCopy}
                            isCopied={isCopied}
                        />
                    </div>
                </div>
            </div>
        </LandingSectionTemplate>
    );
});

CoverGeniusDemo.displayName = "CoverGeniusDemo";
