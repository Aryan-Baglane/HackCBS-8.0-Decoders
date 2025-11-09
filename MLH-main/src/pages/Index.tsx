import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { useNavigate } from "react-router-dom";
import { Features } from "@/components/Features";
import { UseCases } from "@/components/UseCases";
import { TechStack } from "@/components/TechStack";
import { Footer } from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero/>
      <Features />
      <UseCases />
      <TechStack />
      <Footer />
    </div>
  );
};

export default Index;
