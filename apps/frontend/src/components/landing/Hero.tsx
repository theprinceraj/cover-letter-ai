import React, { useState, useEffect, useContext, useCallback, useMemo, memo, useRef } from "react";
import { ChevronRight, Sparkles, FileText, Send } from "lucide-react";
import { Button } from "../ui/Button";
import { AuthContext, GlobalContext } from "../../Contexts";
import { toast } from "sonner";
import { HeroTemplate } from "../ui/HeroTemplate";
import { FRONTEND_ENDPOINTS } from "../../constants";
import { useNavigate } from "react-router-dom";

// Move static data outside component to prevent recreation
const TEXT_SEQUENCE = [
    "Dear Hiring Manager,",
    "I am writing to express my strong interest in...",
    "My experience in software development...",
    "I would welcome the opportunity to...",
    "Thank you for your consideration.",
] as const;

// Typewriter animation configuration
const TYPEWRITER_CONFIG = {
    TYPING_SPEED: 400,
    DELETING_SPEED: 350,
    PAUSE_DURATION: 5000,
};

// Custom hook for typewriter effect with proper cleanup
const useTypewriter = (textSequence: readonly string[]) => {
    const [currentText, setCurrentText] = useState("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const indexRef = useRef(0);
    const charIndexRef = useRef(0);
    const isDeletingRef = useRef(false);

    useEffect(() => {
        const typeWriter = () => {
            const currentWord = textSequence[indexRef.current];

            if (isDeletingRef.current) {
                setCurrentText(currentWord.substring(0, charIndexRef.current - 1));
                charIndexRef.current--;
            } else {
                setCurrentText(currentWord.substring(0, charIndexRef.current + 1));
                charIndexRef.current++;
            }

            let speed = isDeletingRef.current ? TYPEWRITER_CONFIG.DELETING_SPEED : TYPEWRITER_CONFIG.TYPING_SPEED;

            if (!isDeletingRef.current && charIndexRef.current === currentWord.length) {
                speed = TYPEWRITER_CONFIG.PAUSE_DURATION;
                isDeletingRef.current = true;
            } else if (isDeletingRef.current && charIndexRef.current === 0) {
                isDeletingRef.current = false;
                indexRef.current = (indexRef.current + 1) % textSequence.length;
            }

            timeoutRef.current = setTimeout(typeWriter, speed);
        };

        // Start the typewriter effect
        typeWriter();

        // Cleanup function
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [textSequence]);

    return currentText;
};

// Memoized DemoView component
const DemoView = memo(
    ({
        currentText,
        handleCtaBtnClick,
        handleFalseBtnClick,
    }: {
        currentText: string;
        handleCtaBtnClick: () => void;
        handleFalseBtnClick: () => void;
    }) => {
        // Memoize static elements
        const browserDots = useMemo(
            () => (
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-error-500 rounded-full" />
                    <div className="w-3 h-3 bg-warning-500 rounded-full" />
                    <div className="w-3 h-3 bg-success-500 rounded-full" />
                </div>
            ),
            []
        );

        const fileInfo = useMemo(
            () => (
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                    <FileText className="w-4 h-4" />
                    <span>cover-letter.txt</span>
                </div>
            ),
            []
        );

        const progressBars = useMemo(
            () => (
                <div className="space-y-4">
                    <div className="h-3 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full w-3/4" />
                    <div className="h-3 bg-gradient-to-r from-secondary-200 to-accent-200 rounded-full w-full" />
                    <div className="h-3 bg-gradient-to-r from-accent-200 to-primary-200 rounded-full w-5/6" />
                </div>
            ),
            []
        );

        const statusIndicator = useMemo(
            () => (
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                    <span>AI Writing...</span>
                </div>
            ),
            []
        );

        return (
            <div className="relative mb-20">
                <div className="card p-8">
                    <div className="flex items-center justify-between mb-6">
                        {browserDots}
                        {fileInfo}
                    </div>

                    {progressBars}

                    <div className="bg-neutral-50 rounded-lg p-4 min-h-[120px] flex items-center">
                        <div className="font-mono text-neutral-700">
                            {currentText}
                            <span className="animate-pulse">|</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        {statusIndicator}
                        <Button variant="primary" size="sm" onClick={handleCtaBtnClick}>
                            <Send className="w-4 h-4 mr-2" />
                            Apply Now
                        </Button>
                    </div>
                </div>

                {/* Floating Elements */}
                <div
                    className="absolute -bottom-4 -left-2 md:-left-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-medium animate-bounce delay-1000 cursor-pointer"
                    onClick={handleFalseBtnClick}>
                    🚀 Instant Results
                </div>
            </div>
        );
    }
);

DemoView.displayName = "DemoView";

// Memoized Hero content component
const HeroContent = memo(({ onCtaBtnClick }: { onCtaBtnClick: () => void }) => {
    // Memoize static JSX elements
    const badge = useMemo(
        () => (
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 rounded-full mt-6 md:mt-10 lg:mt-0 mb-6 shadow-soft">
                <Sparkles className="size-4 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-orange-700">AI-Powered Writing Assistant</span>
            </div>
        ),
        []
    );

    const heading = useMemo(
        () => (
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-14 md:leading-17">
                <span className="text-primary-500">Craft Perfect</span>
                <br />
                <span className="text-neutral-800">Cover Letters</span>
                <br />
                <span className="text-2xl md:text-3xl text-secondary-600">in Seconds</span>
            </h1>
        ),
        []
    );

    const description = useMemo(
        () => (
            <p className="text-base text-balance md:text-xl text-secondary-600 mb-8 max-w-2xl">
                Transform your job applications with AI tool that understands your story. Create compelling,
                personalized cover letters that get you noticed.
            </p>
        ),
        []
    );

    const demoLink = useMemo(
        () => (
            <a className="btn-secondary px-8 py-4 flex items-center justify-center" href="#demo">
                Watch Demo
            </a>
        ),
        []
    );

    return (
        <div className="text-center lg:text-left">
            {badge}
            {heading}
            {description}

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                    variant="primary"
                    className="px-8 py-4 flex items-center justify-center"
                    onClick={onCtaBtnClick}>
                    Start Writing Now
                    <ChevronRight className="size-5 ml-2" />
                </Button>
                {demoLink}
            </div>
        </div>
    );
});

HeroContent.displayName = "HeroContent";

export const Hero: React.FC = memo(() => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext)!;
    const { openSignInModal } = useContext(GlobalContext)!;

    // Use custom hook for typewriter effect
    const currentText = useTypewriter(TEXT_SEQUENCE);

    // Memoize navigation state
    const canNavigateDirectly = useMemo(() => isAuthenticated, [isAuthenticated]);

    // Memoized handlers
    const handleCtaBtn = useCallback(() => {
        if (canNavigateDirectly) {
            navigate(FRONTEND_ENDPOINTS.GENERATOR);
        } else {
            openSignInModal();
            toast.info("Sign in to proceed");
        }
    }, [canNavigateDirectly, navigate, openSignInModal]);

    const handleFalseBtnClick = useCallback(() => {
        toast.info("This ain't no button buddy");
    }, []);

    return (
        <HeroTemplate>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <HeroContent onCtaBtnClick={handleCtaBtn} />

                {/* Right Column - Interactive Demo */}
                <DemoView
                    currentText={currentText}
                    handleCtaBtnClick={handleCtaBtn}
                    handleFalseBtnClick={handleFalseBtnClick}
                />
            </div>
        </HeroTemplate>
    );
});

Hero.displayName = "Hero";
