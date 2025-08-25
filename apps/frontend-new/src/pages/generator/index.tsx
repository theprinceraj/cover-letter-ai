import HeroTemplate from "../../components/ui/HeroTemplate";
import { Layout } from "../../Layout";
import { SEO } from "../../components/ui/seo";
import { CoverLetterForm } from "./CoverLetterForm";

export const Generator: React.FC = () => {
    return (
        <>
            <SEO
                title="Create Your Cover Letter - CoverGenius AI"
                description="Use our AI-powered generator to create a professional cover letter in minutes. Just upload your resume and job description to get started."
                name="CoverGenius AI"
                type="website"
            />
            <Layout className="bg-dark" hasHeader hasFooter>
                <HeroTemplate>
                    <CoverLetterForm />
                </HeroTemplate>
            </Layout>
        </>
    );
};
