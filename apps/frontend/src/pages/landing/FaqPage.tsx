import { Faq } from "../../components/ui/Faq";
import { Layout } from "../../Layout";

const FAQs = [
    {
        head: "How does CoverGenius work?",
        info: "Simply provide your job role, company name, and a few details about your background. The AI then creates a custom cover letter that you can edit and refine.",
    },
    {
        head: "Who can use CoverGenius?",
        info: "Students, job seekers, professionals switching careers, or anyone applying for roles that require a strong cover letter.",
    },
    {
        head: "Is the generated cover letter unique?",
        info: "Yes. Each cover letter is created from scratch based on the inputs you provide, making it tailored to your application.",
    },
    {
        head: "Can I edit the cover letter after it's generated?",
        info: "Yes, you have the option to copy the letter directly and/or download the letter in the form of an editable text file.",
    },
    {
        head: "Does it guarantee me a job?",
        info: "No tool can guarantee a job, but CoverGenius gives you a strong, well-written cover letter that increases your chances of standing out.",
    },
    {
        head: "How can I purchase more credits?",
        info: "You can buy credits using either INR or USD. For INR, please use Razorpay and for USD, use PayPal. For any other payment method, contact us.",
    },
];

export const FaqPage: React.FC = () => {
    return (
        <Layout className="bg-dark" hasFooter>
            <section id="faq" className="pt-10">
                <div>
                    <h5 className="text-white text-xl font-extrabold">Have Questions About Us?</h5>
                    <div className="my-2">
                        <h2 className="font-extrabold text-4xl text-primary">Cover Genius.</h2>
                        <h3 className="text-white text-3xl font-extrabold">We Might Have Already Answered.</h3>
                    </div>
                </div>
                <div className="mt-15 mb-10 md:mb-20 lg:mb-10 flex flex-col space-y-5">
                    {FAQs && FAQs.map((faq, index) => <Faq head={faq.head} info={faq.info} key={index} />)}
                </div>
            </section>
        </Layout>
    );
};
