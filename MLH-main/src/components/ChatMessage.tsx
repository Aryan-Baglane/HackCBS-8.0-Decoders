import { Loader2, Sparkles } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  isLoading?: boolean;
  mongoQuery?: string;
  responseId?: string;
}

export const ChatMessage = ({ message }: { message: Message }) => {
  if (message.sender === "user") {
    return (
      <div className="flex items-start gap-3 justify-end animate-in slide-in-from-right duration-300">
        <div className="max-w-2xl">
          <div className="gradient-primary rounded-3xl rounded-br-lg p-4 text-primary-foreground shadow-lg">
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
        </div>
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-md">
          U
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 animate-in slide-in-from-left duration-300 ${
        message.isLoading ? "opacity-75" : ""
      }`}
    >
      <div className="flex-shrink-0 h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-glow animate-pulse-slow">
        {message.isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
      </div>
      <div className="max-w-2xl w-full">
        <div className="rounded-3xl rounded-tl-lg bg-card p-5 shadow-xl ring-1 ring-border/50 backdrop-blur-sm">
          <div className="prose prose-sm max-w-none">
            {message.text.split("\n").map((line, i) => {
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="font-semibold text-foreground mt-2 mb-1">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="text-foreground/90 ml-4">
                    {line.substring(2)}
                  </li>
                );
              }
              if (line.match(/^\d+\./)) {
                return (
                  <li key={i} className="text-foreground/90 ml-4 list-decimal">
                    {line.replace(/^\d+\.\s/, "")}
                  </li>
                );
              }
              return line ? (
                <p key={i} className="text-foreground/90 leading-relaxed">
                  {line}
                </p>
              ) : (
                <br key={i} />
              );
            })}
          </div>
          {message.mongoQuery && message.responseId && (
            <div className="mt-4">
              <CodeBlock
                title="MongoDB Query"
                code={message.mongoQuery}
                language="javascript"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
