import { Sparkles } from "lucide-react";

const technologies = [
  { name: "Gemini API", color: "#8b5cf6" },
  { name: "MongoDB", color: "#22c55e" },
  { name: "Solana", color: "#3b82f6" },
  { name: "Auth0", color: "#ef4444" },
  { name: "React", color: "#f97316" },
];

export const TechStack = () => {
  return (
    <section id="tech-stack" className="py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="text-center text-xl font-semibold text-muted-foreground mb-12">
          The technologies powering your new data layer
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:bg-accent/50 hover:-translate-y-2 group animate-in fade-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{ backgroundColor: `${tech.color}20` }}
              >
                <Sparkles
                  className="h-8 w-8 transition-all duration-300 group-hover:rotate-12"
                  style={{ color: tech.color }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
