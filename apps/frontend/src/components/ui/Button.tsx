interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  ref?: React.RefObject<HTMLButtonElement>;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  ref,
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary:
      "bg-primary-500 text-white shadow-soft hover:bg-primary-600 hover:shadow-medium focus:ring-primary-500 focus:ring-offset-primary-500",
    secondary:
      "bg-orange-500 text-white shadow-soft hover:bg-orange-600 hover:shadow-medium focus:ring-orange-500 focus:ring-offset-orange-500",
    outline:
      "border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white hover:shadow-medium focus:ring-purple-500 focus:ring-offset-purple-500",
  };

  const sizeStyles = {
    sm: "text-sm py-2 px-3",
    md: "text-base py-2.5 px-5",
    lg: "text-lg py-3 px-6",
  };

  const cursorStyle =
    disabled || isLoading ? "cursor-not-allowed" : "cursor-pointer";
  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = disabled || isLoading ? "opacity-50" : "";

  return (
    <button
      className={`${baseStyles} ${cursorStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
