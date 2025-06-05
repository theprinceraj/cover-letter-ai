import React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  optional?: boolean;
  showCount?: boolean;
  currentCount?: number;
  maxCount?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  optional = false,
  showCount = false,
  currentCount = 0,
  maxCount,
  className = "",
  id,
  ...props
}) => {
  const uniqueId = id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-baseline mb-1.5">
        <label
          htmlFor={uniqueId}
          className="block text-sm font-medium text-slate-200"
        >
          {label}
          {!optional && <span className="text-purple-400 ml-1">*</span>}
          {optional && (
            <span className="text-slate-400 text-xs ml-1">(Optional)</span>
          )}
        </label>

        {showCount && (
          <div className="text-xs text-slate-400">
            {currentCount} {maxCount && `/ ${maxCount}`}{" "}
            {maxCount ? "characters" : "words"}
          </div>
        )}
      </div>

      <textarea
        id={uniqueId}
        className={`w-full px-4 py-3 bg-slate-800 border ${error ? "border-red-500" : "border-slate-700"} 
                    rounded-lg shadow-sm text-slate-200 placeholder-slate-500 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    transition-colors duration-200 resize-y
                    ${className}`}
        {...props}
      />

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};
