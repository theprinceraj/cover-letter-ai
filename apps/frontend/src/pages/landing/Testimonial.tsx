import { TestimonialsContainer } from "../../components/ui/TestimonialsContainer";
import { Layout } from "../../Layout";

const emptyTestimonials = [
    {
        img: "https://avatar.iran.liara.run/public",
        text: "This space is waiting for your success story! Be the first to land your dream job with CoverGenius.",
        author: "Your Name Here",
    },
    {
        img: "https://avatar.iran.liara.run/public",
        text: "We're saving this spot for you! Share how CoverGenius helped you get that interview.",
        author: "Future Success Story",
    },
    {
        img: "https://avatar.iran.liara.run/public",
        text: "Your testimonial could be right here! Use CoverGenius and tell us about your experience.",
        author: "Next Happy Customer",
    },
];

export const Testimonial: React.FC = () => {
    return (
        <Layout className="bg-primary">
            <div className="mt-10 lg:mt-0">
                <h5 className="text-dark text-xl font-extrabold">AI-powered Cover Letter Assistant</h5>
                <div className="my-2">
                    <h2 className="font-extrabold text-4xl text-white">Cover Genius</h2>
                    <h3 className="text-3xl font-extrabold">Know What Our Users Say</h3>
                </div>
            </div>
            <div className="my-20 w-full lg:w-2/3 mx-auto">
                <TestimonialsContainer testimonials={emptyTestimonials} />
            </div>
        </Layout>
    );
};
