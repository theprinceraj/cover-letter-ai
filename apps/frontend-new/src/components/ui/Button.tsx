import { MoveRightIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

const ButtonVariants = {
    white: "white",
    dark: "dark",
    yellow: "yellow",
} as const;

type ButtonVariants = (typeof ButtonVariants)[keyof typeof ButtonVariants];

interface ButtonProps {
    variant?: ButtonVariants;
    className?: string;
}

const baseStyles = `group hover:cursor-pointer font-bold py-2 md:py-4 lg:py-6 px-5 md:px-7 lg:px-10 flex justify-between gap-2 items-center sm:text-base md:text-lg lg:text-xl rounded-full duration-200 `;
const btnStyles = {
    yellow: "bg-primary",
    white: "bg-white outline-2 outline-primary hover:shadow-[8px_8px_0_0_theme('colors.primary')]",
    dark: "text-white bg-dark outline-2 outline-white hover:shadow-[8px_8px_0_0_#fff]",
};

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({ children, variant = ButtonVariants.yellow, className }) => {
    const styles = `${baseStyles} ${btnStyles[variant]} ${className}`;

    return (
        <button className={`${styles}`}>
            <span>{children}</span>
            <MoveRightIcon className="size-5 lg:size-7 transition-transform group-hover:rotate-90" />
        </button>
    );
};

export default Button;
