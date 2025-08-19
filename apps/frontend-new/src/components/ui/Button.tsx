import { MoveRightIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

const ButtonVariants = {
    white: "white",
    dark: "dark",
    yellow: "yellow",
} as const;
type ButtonVariants = (typeof ButtonVariants)[keyof typeof ButtonVariants];

const ButtonSizes = {
    sm: "py-1.5 px-4 text-sm",
    md: "py-2 md:py-3 px-5 md:px-7 text-base md:text-lg",
    lg: "py-3 md:py-4 lg:py-6 px-6 md:px-9 lg:px-10 text-lg md:text-xl lg:text-2xl",
} as const;
type ButtonSize = keyof typeof ButtonSizes;

export interface ButtonProps {
    variant?: ButtonVariants;
    size?: ButtonSize;
    isLoading?: boolean;
    className?: string;
    disabled?: boolean;
}

const baseStyles = "group font-bold flex justify-between gap-2 items-center rounded-full duration-200";
const variantStyles = {
    yellow: "bg-primary",
    white: "bg-white outline-2 outline-primary hover:shadow-[8px_8px_0_0_theme('colors.primary')]",
    dark: "text-white bg-dark outline-2 outline-white hover:shadow-[8px_8px_0_0_#fff]",
};

const Button: React.FC<PropsWithChildren<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({
    children,
    variant = ButtonVariants.yellow,
    size = "md",
    isLoading = false,
    disabled = false,
    onClick = () => {},
    className = "",
    ...props
}) => {
    const styles = [baseStyles, ButtonSizes[size], variantStyles[variant], className].join(" ");
    const loaderStyles = `animate-spin size-4 ${"text-" + variant === ButtonVariants.yellow ? `primary` : variant}`;
    const cursorStyle = disabled || isLoading ? "hover:cursor-not-allowed" : "hover:cursor-pointer";
    const disabledStyles = disabled || isLoading ? "cursor-not-allowed opacity-50" : "";

    return (
        <button
            className={`${styles} ${cursorStyle} ${disabledStyles}`}
            onClick={onClick}
            disabled={disabled}
            {...props}>
            {isLoading ? (
                <div className="flex items-center">
                    <svg className={loaderStyles} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : (
                <>
                    <span>{children}</span>
                    <MoveRightIcon
                        className={`transition-transform group-hover:rotate-90 ${
                            size === "sm" ? "size-4" : size === "md" ? "size-5" : "size-7"
                        }`}
                    />
                </>
            )}
        </button>
    );
};

export default Button;
