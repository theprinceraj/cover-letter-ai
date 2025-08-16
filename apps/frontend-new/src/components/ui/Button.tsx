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

interface ButtonProps {
    variant?: ButtonVariants;
    size?: ButtonSize;
    className?: string;
}

const baseStyles =
    "group hover:cursor-pointer font-bold flex justify-between gap-2 items-center rounded-full duration-200";
const variantStyles = {
    yellow: "bg-primary",
    white: "bg-white outline-2 outline-primary hover:shadow-[8px_8px_0_0_theme('colors.primary')]",
    dark: "text-white bg-dark outline-2 outline-white hover:shadow-[8px_8px_0_0_#fff]",
};

const Button: React.FC<PropsWithChildren<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({
    children,
    variant = ButtonVariants.yellow,
    size = "md",
    onClick,
    className = "",
}) => {
    const styles = [baseStyles, ButtonSizes[size], variantStyles[variant], className].join(" ");

    return (
        <button className={styles} onClick={onClick}>
            <span>{children}</span>
            <MoveRightIcon
                className={`transition-transform group-hover:rotate-90 ${
                    size === "sm" ? "size-4" : size === "md" ? "size-5" : "size-7"
                }`}
            />
        </button>
    );
};

export default Button;
