import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

interface FaqProps {
    head: string;
    info: string;
}

const containerStyle = `bg-white px-8 md:px-12 py-8 flex gap-4 hover:cursor-pointer justify-between items-start w-full rounded-4xl`;
const btnStyle = `text-primary size-6 md:size-8 lg:size-10`;

export const Faq: React.FC<FaqProps> = ({ head, info }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const infoStyle = `w-full md:text-xl pt-4 overflow-y-clip text-balance md:text-wrap transition-all duration-200 ${isOpen ? "opacity-100 max-h-fit" : "max-h-0 opacity-0"}`;

    return (
        <div className={containerStyle} onClick={handleClick}>
            <div>
                <h3 className="font-extrabold text-lg md:text-2xl">{head}</h3>
                <p className={infoStyle}>{info}</p>
            </div>
            <button aria-label="Expand this FAQ">
                {isOpen ? <MinusIcon className={btnStyle} /> : <PlusIcon className={btnStyle} />}
            </button>
        </div>
    );
};
