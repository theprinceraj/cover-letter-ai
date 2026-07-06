import { useState } from "react";
import Button from "./Button";
import { Check, Copy, Download, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cleanMarkdownText } from "../../utils/text";
import Turnstile from "react-turnstile";

interface CoverLetterPreviewProps {
    coverLetter: string;
    setCoverLetter: (val: string) => void;
    suggestions: string[];
    setSuggestions: (val: string[]) => void;
    onDownload: () => void;
    fetchWithAuth: any;
    className?: string;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
    coverLetter,
    setCoverLetter,
    suggestions,
    setSuggestions,
    onDownload,
    fetchWithAuth,
    className = "",
}) => {
    const cleanedSuggestions = suggestions.filter((suggestion) => cleanMarkdownText(suggestion).trim() !== "");
    const [copied, setCopied] = useState(false);

    // Refinement states
    const [instruction, setInstruction] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [refining, setRefining] = useState(false);
    const [turnstileKey, setTurnstileKey] = useState(0); // Used to force-reset turnstile

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(coverLetter);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Cover letter copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy cover letter");
            console.error("Failed to copy cover letter:", error);
        }
    };

    const handleRefine = async (presetInstruction?: string) => {
        const activeInstruction = presetInstruction || instruction;
        if (!activeInstruction.trim()) {
            toast.error("Please select or type an instruction first");
            return;
        }

        if (!captchaToken) {
            toast.error("Please complete the captcha verification first");
            return;
        }

        setRefining(true);
        try {
            const response = (await fetchWithAuth({
                url: "/eval/refine",
                method: "POST",
                data: {
                    coverLetter,
                    instruction: activeInstruction,
                    captchaToken,
                },
            })) as { coverLetter: string; suggestions: string[] } | { error: true; message: string };

            if ("error" in response) {
                toast.error(response.message);
                return;
            }

            setCoverLetter(response.coverLetter);
            setSuggestions(response.suggestions);
            setInstruction("");
            setCaptchaToken(null);
            setTurnstileKey(prev => prev + 1); // Reset Turnstile for next action
            toast.success("Cover letter refined successfully!");
        } catch (err) {
            console.error("Error refining cover letter:", err);
            toast.error("Failed to refine cover letter");
        } finally {
            setRefining(false);
        }
    };

    const presets = [
        "Make it sound more professional",
        "Make it more enthusiastic and passionate",
        "Shorten the letter by removing fluff",
        "Elaborate more on my technical skills and experiences",
    ];

    return (
        <div className={`space-y-6 text-start ${className}`}>
            {/* Editor (Full Width) */}
            <div className="bg-primary/20 text-slate-100 rounded-lg shadow-sm overflow-hidden border border-slate-700">
                <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-primary">
                        Live Cover Letter Editor
                    </h3>
                    <div className="flex items-center gap-2">
                        <Button variant="yellow" size="sm" onClick={handleCopy} IconLucide={copied ? Check : Copy}>
                            {copied ? "Copied" : "Copy"}
                        </Button>
                        <Button variant="yellow" size="sm" onClick={onDownload} IconLucide={Download}>
                            Download
                        </Button>
                    </div>
                </div>
                <div className="p-4 bg-slate-900/50">
                    <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={16}
                        className="w-full bg-transparent text-slate-100 font-mono text-sm leading-relaxed focus:outline-none resize-y border-none p-2"
                        placeholder="Edit your cover letter here..."
                    />
                </div>
            </div>

            {/* Bottom Row: AI Refinement (Left) & Suggestions (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Refinement Panel */}
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-5 space-y-4 flex flex-col justify-between">
                    <div>
                        <h4 className="text-md font-semibold text-white flex items-center gap-2 mb-2">
                            <Sparkles className="size-5 text-primary" />
                            Refine with AI
                        </h4>
                        <p className="text-xs text-slate-400 mb-4">
                            Ask the AI to rewrite sections, change style, or add specific details.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Presets */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300">Quick Presets</label>
                                <div className="flex flex-col gap-1.5">
                                    {presets.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setInstruction(preset);
                                            }}
                                            disabled={refining}
                                            className="text-left text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-2.5 rounded border border-slate-700 transition-colors truncate"
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Instruction */}
                            <div className="space-y-2 flex flex-col">
                                <label className="text-xs font-semibold text-slate-300">Custom Request</label>
                                <textarea
                                    value={instruction}
                                    onChange={(e) => setInstruction(e.target.value)}
                                    placeholder="e.g. Highlight my experience in team leadership..."
                                    rows={4}
                                    disabled={refining}
                                    className="w-full grow bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                        {/* Turnstile Captcha */}
                        <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                            <Turnstile
                                key={turnstileKey}
                                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "unknown-site-key"}
                                execution="render"
                                onVerify={(token) => setCaptchaToken(token)}
                                onExpire={() => setCaptchaToken(null)}
                                theme="dark"
                                size="compact"
                            />
                        </div>

                        <Button
                            variant="white"
                            size="sm"
                            className="w-full sm:w-48 justify-center text-xs font-semibold h-10"
                            onClick={() => handleRefine()}
                            disabled={refining || !captchaToken || !instruction.trim()}
                        >
                            {refining ? (
                                <span className="flex items-center gap-1">
                                    <Loader2 className="animate-spin size-3" /> Refining...
                                </span>
                            ) : (
                                "Apply AI Refinement"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Suggestions Box */}
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="size-6 bg-primary text-dark font-extrabold rounded-full flex items-center justify-center">
                                <span className="font-semibold text-xs">{cleanedSuggestions.length || 0}</span>
                            </div>
                            <h4 className="text-md font-semibold text-white">Suggestions for Improvement</h4>
                        </div>
                    </div>

                    <div className="grow">
                        {cleanedSuggestions && cleanedSuggestions.length > 0 ? (
                            <div className="space-y-3 overflow-y-auto max-h-55 pr-1">
                                {cleanedSuggestions.map((suggestion, index) => (
                                    <div key={index} className="flex gap-2 text-xs text-slate-300 items-start">
                                        <span className="text-primary font-semibold shrink-0">{index + 1}.</span>
                                        <p className="text-start">{cleanMarkdownText(suggestion)}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs text-slate-500 py-8">
                                No suggestions available. Your cover letter looks solid!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

