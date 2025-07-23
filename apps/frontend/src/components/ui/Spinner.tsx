import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "overlay";
  message?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "default",
  message,
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} border-2 border-secondary-600 rounded-full animate-pulse`}
        />
        {/* Spinning ring */}
        <div
          className={`${sizeClasses[size]} border-2 border-transparent border-t-orange-500 rounded-full animate-spin absolute top-0 left-0`}
        />
        {/* Inner glow */}
        <div
          className={`${sizeClasses[size]} border-2 border-orange-500/20 rounded-full absolute top-0 left-0 animate-ping`}
        />
      </div>
      {message && (
        <p className="mt-4 text-white text-center font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-secondary-500 rounded-xl shadow-2xl border border-secondary-300 p-8 max-w-sm mx-4">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return spinnerContent;
};
