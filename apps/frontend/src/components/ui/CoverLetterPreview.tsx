import { useState } from "react";
import { Button } from "./Button";
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
  const cleanedSuggestions = suggestions.filter(
    (suggestion) => cleanMarkdownText(suggestion).trim() !== ""
  );

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
      <div className="bg-orange-50 text-secondary-900 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              <span className="hidden md:inline">Cover Letter</span> Preview
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check size={16} className="mr-1" />
                    <span className="hidden md:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    <span className="hidden md:inline">Copy</span>
                  </>
                )}
              </Button>
              <Button variant="primary" size="sm" onClick={onDownload}>
                <Download size={16} className="mr-1" />
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
        <div className="text-secondary-900 rounded-lg">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary-100 hover:rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full hidden md:flex md:items-center md:justify-center">
                <span className="font-medium text-sm">
                  {cleanedSuggestions.length}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Suggestions for Improvement
                </h3>
                <p className="text-sm">
                  AI-powered recommendations to enhance your cover letter
                </p>
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
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white"
                  >
                    <div className="w-6 h-6 bg-orange-500 rounded-full hidden md:flex md:items-center md:justify-center md:shrink-0 md:mt-0.5">
                      <span className="text-white text-xs font-semibold">
                        {index + 1}
                      </span>
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
