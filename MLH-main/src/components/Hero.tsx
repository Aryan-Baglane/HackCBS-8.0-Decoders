import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

export const Hero = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: "/Querypage" },
    });
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-32 hero-glow">
      <div className="container mx-auto max-w-7xl px-4 text-center lg:px-8">

        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6 ring-1 ring-primary/20 backdrop-blur-sm animate-in fade-in slide-in-from-top duration-700">
          <Sparkles className="h-4 w-4" />
          <span>Powered by Gemini API</span>
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          Your Data,{" "}
          <span className="gradient-primary bg-clip-text text-transparent">
            In Your Words.
          </span>
        </h1>
        
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          Stop querying. Start asking. DataQuery AI unlocks your company's MongoDB data with plain English.
          No code, no queries, just answers.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <Button
            onClick={handleLogin}
            size="lg"
            className="gradient-primary-hover w-full sm:w-auto text-lg font-medium shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto text-lg font-medium border-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105"
          >
            <a href="#features">Learn More</a>
          </Button>
        </div>
      </div>

      {/* … rest stays unchanged … */}
    </section>
  );
};
