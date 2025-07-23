import { Testimonials } from "../components/landing/Testimonials";
import { Features } from "../components/landing/Features";
import { Header } from "../components/Header";
import { Hero } from "../components/landing/Hero";
import { Pricing } from "../components/landing/Pricing";
import { CoverGeniusDemo } from "../components/landing/CoverGeniusDemo";
import { Footer } from "../components/Footer";
import { SEO } from "../components/seo/SEO";

export const Landing = () => {
  return (
    <>
      <SEO
        title="CoverGenius AI - AI-Powered Cover Letter Generator"
        description="Generate personalized, professional cover letters instantly with AI. Upload your resume and job description to create a tailored cover letter that helps you stand out."
        name="CoverGenius AI"
        type="website"
      />
      <div className="min-h-screen bg-white">
        <Header />
        <Hero />
        <Features />
        <CoverGeniusDemo />
        <Pricing />
        <Testimonials />
        <Footer />
      </div>
    </>
  );
};
