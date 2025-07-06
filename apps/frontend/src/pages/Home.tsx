import { CoverLetterForm } from "../components/CoverLetterForm";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";

export const Home: React.FC = () => {
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
