import { CheckIcon } from "lucide-react";

interface PillProps {
    variant: "white" | "yellow";
    text: string;
}

export const Pill: React.FC<PillProps> = ({ variant, text }) => {
    const isWhite = variant == "white";
    const variantStyle = isWhite ? `bg-primary/10` : ``;

    return (
        <div className={`bg-white rounded-4xl font-medium overflow-clip`}>
            <div className={`flex items-center justify-center gap-3 py-4 px-8 ${variantStyle}`}>
                <CheckIcon className="size-5 text-primary outline-3 rounded-full outline-primary" />
                <p className="text-lg">{text}</p>
            </div>
        </div>
    );
};
