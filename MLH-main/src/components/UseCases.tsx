import { Check } from "lucide-react";
import { RevenueChart } from "./RevenueChart";

const useCases = [
  {
    department: "Sales Teams",
    question: "Who are my top 10 customers by lifetime value?",
  },
  {
    department: "Marketing Dept",
    question: "Compare user acquisition cost for our last 3 campaigns.",
  },
  {
    department: "Executives",
    question: "What was our monthly recurring revenue for the last 6 months?",
  },
];

export const UseCases = () => {
  return (
    <section id="use-cases" className="py-24 bg-secondary/30">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h2 className="text-base font-semibold tracking-wide text-primary uppercase mb-2">
              Use Cases
            </h2>
            <p className="text-4xl font-extrabold text-foreground tracking-tight mb-4">
              Who is this for?
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Empower every department to make data-driven decisions, no technical skills required.
            </p>
            
            <ul className="space-y-6">
              {useCases.map((useCase, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 animate-in fade-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-base text-foreground">
                    <strong className="font-semibold">{useCase.department}:</strong>{" "}
                    <span className="text-muted-foreground">"{useCase.question}"</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 lg:mt-0 animate-in fade-in slide-in-from-right duration-700 delay-300">
            <RevenueChart />
          </div>
        </div>
      </div>
    </section>
  );
};
