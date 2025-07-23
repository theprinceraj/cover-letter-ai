import { CoverLetterForm } from "../components/generator/CoverLetterForm";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { HeroTemplate } from "../components/ui/HeroTemplate";
import { SEO } from "../components/seo/SEO";

export const Generator: React.FC = () => {
  return (
    <>
      <SEO
        title="Create Your Cover Letter - CoverGenius AI"
        description="Use our AI-powered generator to create a professional cover letter in minutes. Just upload your resume and job description to get started."
        name="CoverGenius AI"
        type="website"
      />
      <Header />
      <main>
        <HeroTemplate>
          <CoverLetterForm />
        </HeroTemplate>
      </main>
      <Footer />
    </>
  );
};
