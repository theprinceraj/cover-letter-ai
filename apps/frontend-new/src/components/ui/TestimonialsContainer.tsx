import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react";
import { useState } from "react";

interface Testimonial {
    img: string;
    text: string;
    author: string;
}

interface TestimonialProps {
    variant?: "white" | "dark";
    testimonials: Testimonial[];
}

export const TestimonialsContainer: React.FC<TestimonialProps> = ({ variant = "white", testimonials }) => {
    const [current, setCurrent] = useState<number>(0);

    console.log(variant);

    const onLeftClick = () => {
        if (current > 0) setCurrent(current - 1);
    };
    const onRightClick = () => {
        if (current < testimonials.length - 1) setCurrent(current + 1);
    };

    const testOnState = testimonials[current];

    return (
        <TestimonialCard
            img={testOnState.img}
            text={testOnState.text}
            author={testOnState.author}
            handleLeftClick={onLeftClick}
            handleRightClick={onRightClick}
        />
    );
};

const TestimonialCard: React.FC<
    TestimonialProps["testimonials"][number] & {
        handleLeftClick: () => void;
        handleRightClick: () => void;
    }
> = ({ img, text, author, handleLeftClick, handleRightClick }) => {
    const truncatedText = text.substring(0, 150) + (text.length > 100 ? "..." : "");
    return (
        <div className="bg-white px-4 py-10 lg:px-14 lg:py-20 rounded-4xl flex flex-col justify-center items-center space-y-10 lg:flex-row">
            <div className="rounded-full px-4 lg:">
                <img src={img} alt="Testimonial Author Picture" />
            </div>
            <div className="flex flex-col items-center justify-center lg:items-start space-y-10 lg:min-w-2/3">
                <div className="text-center lg:text-left flex flex-col items-center justify-center lg:items-start space-y-5">
                    <h3 className="text-balance text-2xl md:text-3xl lg:text-4xl font-bold">
                        What our <br className="md:hidden" />
                        customers thought?
                    </h3>
                    <p className="text-sm md:text-lg lg:text-2xl px-2 italic min-h-[70px]">{truncatedText}</p>
                    <h4 className="text-xl font-extrabold">{author}</h4>
                </div>
                <div className="flex space-x-4">
                    <button onClick={handleLeftClick} className="cursor-pointer">
                        <ArrowLeftCircleIcon className="size-10 md:size-14" />
                    </button>
                    <button onClick={handleRightClick} className="cursor-pointer">
                        <ArrowRightCircleIcon className="text-primary size-10 md:size-14" />
                    </button>
                </div>
            </div>
        </div>
    );
};
