import DummyImg from "../../assets/dummy-pic.png";
import { Box } from "../../components/ui/Box";
import Button from "../../components/ui/Button";
import { Faq } from "../../components/ui/Faq";
import HeroTemplate from "../../components/ui/HeroTemplate";
import { Pill } from "../../components/ui/Pill";
import { TestimonialsContainer } from "../../components/ui/TestimonialsContainer";
import { MapPinIcon } from "lucide-react";

const sectionStyle = "flex gap-10 flex-wrap p-10 my-10 bg-gray-900";

export const UI: React.FC = () => {
    return (
        <section className="w-full">
            <HeroTemplate>
                <div className={sectionStyle}>
                    <Button variant="white">Hello</Button>
                    <Button variant="dark">Hello</Button>
                    <Button variant="yellow">Hello</Button>
                </div>
                <div className={sectionStyle}>
                    <Box variant="white" IconLucide={MapPinIcon} order={1} heading="Phasellus Vitae" sh="Quisque" />
                    <Box variant="dark" IconLucide={MapPinIcon} order={1} heading="Phasellus Vitae" sh="Quisque" />
                </div>
                <div className={sectionStyle}>
                    <Pill variant="white" text="Cursus Integer" />
                    <Pill variant="yellow" text="Cursus Integer" />
                </div>
                <div className="flex gap-10 p-10 my-10 bg-gray-900">
                    <Faq
                        head="Quam vehicula faucibus amet lorem"
                        info="Euismod magna id purus eget nunc ligula suspendisse dui netus. Condimentum blandit rutrum at mauris enim pulvinar duis etiam duis. Mauris fermentum praesent tellus euismod."
                    />
                </div>
                <div className="flex gap-10 p-10 my-10 bg-gray-900">
                    <TestimonialsContainer variant="white" testimonials={testimonials} />
                </div>
            </HeroTemplate>
        </section>
    );
};

const testimonials = [
    {
        img: DummyImg,
        author: "Your Name Here",
        text: "This space is waiting for your success story! Be the first to land your dream job with CoverGenius.",
    },
    {
        img: DummyImg,
        author: "Future Success Story",
        text: "We're saving this spot for you! Share how CoverGenius helped you get that interview.",
    },
    {
        img: DummyImg,
        author: "Next Happy Customer",
        text: "Your testimonial could be right here! Use CoverGenius and tell us about your experience.",
    },
];
