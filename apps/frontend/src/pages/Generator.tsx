import { CoverLetterForm } from "../components/generator/CoverLetterForm";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { HeroTemplate } from "../components/ui/HeroTemplate";

export const Generator: React.FC = () => {
  return (
    <>
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
