import type { LucideIcon } from "lucide-react";

interface BoxProps {
    variant: "white" | "dark";
    IconLucide: LucideIcon;
    order: number;
    heading: string;
    sh: string;
}

const baseStyle =
    "group hover:bg-dark text-dark hover:text-white hover:outline-2 hover:outline-primary hover:shadow-lg hover:shadow-primary rounded-4xl py-8 pl-12 pr-24 flex flex-col gap-4 duration-150 lg:max-w-md";

export const Box: React.FC<BoxProps> = ({ variant, IconLucide, order, heading, sh }) => {
    const isWhite = variant == "white";
    const variantStyle = isWhite ? `bg-white` : `bg-primary`;
    const dotStyle = isWhite ? "text-primary" : "text-white group-hover:text-primary";
    const styles = `${baseStyle} ${variantStyle}`;
    return (
        <div className={styles}>
            <div className="size-16">
                <IconLucide className="size-16" />
            </div>
            <div>
                <h3 className="text-7xl font-extrabold">
                    <span>{order}</span>
                    <span className={dotStyle}>.</span>
                </h3>
            </div>
            <h4 className="text-2xl font-extrabold my-5">{heading}</h4>
            <div>
                <h4 className="font-bold text-xl">{sh}</h4>
            </div>
        </div>
    );
};
