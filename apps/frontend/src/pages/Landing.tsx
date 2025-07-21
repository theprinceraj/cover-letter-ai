import { Testimonials } from "../components/landing/Testimonials";
import { Features } from "../components/landing/Features";
import { Header } from "../components/Header";
import { Hero } from "../components/landing/Hero";
import { Pricing } from "../components/landing/Pricing";
import { CoverGeniusDemo } from "../components/landing/CoverGeniusDemo";
import { Footer } from "../components/Footer";

export const Landing = () => {
  return (
    <>
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
