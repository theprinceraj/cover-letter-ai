import React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  optional?: boolean;
  showCount?: boolean;
  currentCount?: number;
  maxCount?: number;
  disabled?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  optional = false,
  showCount = false,
  currentCount = 0,
  maxCount,
  className = "",
  disabled = false,
  id,
  ...props
}) => {
  const uniqueId = id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-baseline mb-1.5">
        <label
          htmlFor={uniqueId}
          className="block text-sm font-medium text-secondary-600"
        >
          {label}
          {!optional && (
            <span className="text-orange-500 ml-1 font-extrabold">*</span>
          )}
          {optional && (
            <span className="text-secondary-400 text-xs ml-1">(Optional)</span>
          )}
        </label>

        {showCount && (
          <div className="text-xs text-secondary-900 ml-4">
            {currentCount} {maxCount && `/ ${maxCount}`}{" "}
            {maxCount ? "characters" : "words"}
          </div>
        )}
      </div>

      <textarea
        id={uniqueId}
        className={`w-full px-4 py-3 bg-white border ${error ? "border-red-500" : "border-secondary-300"} 
                    rounded-lg shadow-sm text-secondary-900 placeholder-secondary-400 
                    focus:outline-none focus:ring focus:ring-orange-500 focus:border-transparent
                    transition-colors duration-200 resize-y
                    ${disabled ? "cursor-not-allowed" : "cursor-text"}
                    ${className}`}
        disabled={disabled}
        {...props}
      />

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};
