import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  title: string;
  code: string;
  language: string;
}

export const CodeBlock = ({ title, code, language }: CodeBlockProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-slate-900 ring-1 ring-slate-700 overflow-hidden shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 font-mono text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-success" />
          ) : (
            <ChevronRight className="h-4 w-4 text-success" />
          )}
          <span className="font-medium text-success">{title}</span>
        </span>
        <span className="text-xs text-slate-500">
          {isOpen ? "Click to collapse" : "Click to expand"}
        </span>
      </button>

      {isOpen && (
        <div className="relative border-t border-slate-700">
          <div className="absolute top-3 right-3 z-10">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span className="text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          </div>
          <pre className="p-4 overflow-x-auto code-window bg-slate-900/50">
            <code className="text-sm text-slate-200 leading-relaxed font-mono">
              {code}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};
