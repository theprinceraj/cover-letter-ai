import { Header } from "../components/Header";
import { CoverLetterForm } from "../components/generator/CoverLetterForm";
import { Footer } from "../components/Footer";
import { Hero } from "../components/generator/Hero";

export const Generator: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CoverLetterForm />
      </main>
      <Footer />
    </>
  );
};
