import { Sparkles, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Natural Language Query",
    description:
      "Ask complex questions in plain English. The Gemini API translates your intent into precise MongoDB queries.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Data Summarization",
    description:
      "Don't just get raw data. Gemini provides summaries, insights, and charts, turning raw JSON into actionable intelligence.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Secure & Auditable",
    description:
      "Enterprise-grade security with Auth0. Plus, all queries are logged on the Solana blockchain for a transparent, immutable audit trail.",
    gradient: "from-orange-500 to-red-500",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold tracking-wide text-primary uppercase mb-2">
            Features
          </h2>
          <p className="text-4xl font-extrabold text-foreground tracking-tight">
            The future of data interaction
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-card rounded-2xl shadow-lg ring-1 ring-border transition-all duration-300 hover:-translate-y-2 hover:shadow-glow animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
