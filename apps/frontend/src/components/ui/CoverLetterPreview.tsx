import { useState } from "react";
import { Button } from "./Button";
import { Check, ChevronDown, ChevronUp, Copy, Download } from "lucide-react";

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
  const [copied, setCopied] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy cover letter:", error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cover Letter Preview */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Cover Letter Preview
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-slate-600 hover:bg-slate-700"
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="primary" size="sm" onClick={onDownload}>
                <Download size={16} className="mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {suggestions.length}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Suggestions for Improvement
                </h3>
                <p className="text-slate-400 text-sm">
                  AI-powered recommendations to enhance your cover letter
                </p>
              </div>
            </div>
            {showSuggestions ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>

          {showSuggestions && (
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-slate-700 rounded-lg border border-slate-600"
                  >
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {suggestion}
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
