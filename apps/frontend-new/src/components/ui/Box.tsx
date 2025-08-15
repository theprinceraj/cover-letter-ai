interface BoxProps {
    variant: "white" | "dark";
    icon: string;
    order: number;
    heading: string;
    sh1: string;
    sh2: string;
}

const baseStyle =
    "group hover:bg-dark text-dark hover:text-white rounded-4xl py-8 pl-12 pr-24 flex flex-col gap-4 duration-200";

export const Box: React.FC<BoxProps> = ({ variant, icon, order, heading, sh1, sh2 }) => {
    const isWhite = variant == "white";
    const variantStyle = isWhite ? `bg-white` : `bg-primary`;
    const dotStyle = isWhite ? "text-primary" : "text-white group-hover:text-primary";
    const styles = `${baseStyle} ${variantStyle}`;
    return (
        <div className={styles}>
            <div className="size-16">
                <img src={icon} alt="Icon" />
            </div>
            <div>
                <h3 className="text-7xl font-extrabold">
                    <span>{order}</span>
                    <span className={dotStyle}>.</span>
                </h3>
            </div>
            <h4 className="text-2xl font-extrabold my-5">{heading}</h4>
            <div>
                <h4 className="font-bold text-xl">{sh1}</h4>
                <p className="font-light text-base">{sh2}</p>
            </div>
        </div>
    );
};
