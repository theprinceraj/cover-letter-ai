import { useState } from "react";
import Button from "./Button";
import { Check, ChevronDown, ChevronUp, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { cleanMarkdownText } from "../../utils/text";

interface CoverLetterPreviewProps {
    coverLetter: string;
    suggestions: string[];
    onDownload: () => void;
    className?: string;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
    coverLetter,
    suggestions,
    onDownload,
    className = "",
}) => {
    const cleanedCoverLetter = cleanMarkdownText(coverLetter);
    const cleanedSuggestions = suggestions.filter((suggestion) => cleanMarkdownText(suggestion).trim() !== "");
    const [copied, setCopied] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(cleanedCoverLetter);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy cover letter");
            console.error("Failed to copy cover letter:", error);
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Cover Letter Preview */}
            <div className="bg-primary/20 text-secondary-900 rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                            <span className="hidden md:inline">Cover Letter</span> Preview
                        </h3>
                        <div className="flex items-center gap-2">
                            <Button variant="yellow" size="sm" onClick={handleCopy} IconLucide={copied ? Check : Copy}>
                                {copied ? (
                                    <span className="hidden md:inline">Copied</span>
                                ) : (
                                    <span className="hidden md:inline">Copy</span>
                                )}
                            </Button>
                            <Button variant="yellow" size="sm" onClick={onDownload} IconLucide={Download}>
                                <span className="hidden md:block">Download</span>
                            </Button>
                        </div>
                    </div>
                    <div className="whitespace-pre-line text-start text-wrap">
                        <span>{cleanedCoverLetter}</span>
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            {cleanedSuggestions && cleanedSuggestions.length > 0 && (
                <div className="rounded-lg outline outline-primary">
                    <button
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary-100 hover:rounded-lg transition-colors"
                        aria-label="Expand Suggestions">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-primary text-dark font-extrabold rounded-full hidden md:flex md:items-center md:justify-center">
                                <span className="font-medium text-sm">{cleanedSuggestions.length}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Suggestions for Improvement</h3>
                                <p className="text-sm">AI-powered recommendations to enhance your cover letter</p>
                            </div>
                        </div>
                        {showSuggestions ? (
                            <div className="bg-primary-500 rounded-full p-1">
                                <ChevronUp className="size-8 text-white" />
                            </div>
                        ) : (
                            <div className="bg-primary-500 rounded-full p-1">
                                <ChevronDown className="size-8 text-white" />
                            </div>
                        )}
                    </button>

                    {showSuggestions && (
                        <div className="px-2 md:px-6 pb-6">
                            <div className="space-y-4">
                                {cleanedSuggestions.map((suggestion, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4">
                                        <div className="size-6 text-dark bg-primary rounded-full hidden md:flex md:items-center md:justify-center md:shrink-0 md:mt-0.5">
                                            <span className="text-xs font-semibold">{index + 1}</span>
                                        </div>
                                        <p className="text-start text-sm md:text-base">
                                            {cleanMarkdownText(suggestion)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
