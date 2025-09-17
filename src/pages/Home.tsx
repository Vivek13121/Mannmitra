import HeroSection from "../components/HeroSection";
import SIHProblemSection from "../components/SIHProblemSection";
import FeatureSection from "../components/FeatureSection";
import SIHSolutionFlow from "../components/SIHSolutionFlow";
import AssessmentSection from "../components/AssessmentSection";

interface HomeProps {
  onShowAuth: () => void;
}

const Home = ({ onShowAuth }: HomeProps) => {
  return (
    <main>
      <HeroSection onShowAuth={onShowAuth} />
      <SIHProblemSection />
      <FeatureSection />
      <SIHSolutionFlow />
      <AssessmentSection />
    </main>
  );
};

export default Home;
