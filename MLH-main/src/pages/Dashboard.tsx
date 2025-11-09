import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { useAuth0 } from "@auth0/auth0-react";   // ✅ Added
import { useNavigate } from "react-router-dom";   // ✅ Added

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  isLoading?: boolean;
  mongoQuery?: string;
  responseId?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();   // ✅ Added

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Welcome to DataQuery AI! I'm connected to your MongoDB database. What would you like to know?",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userQuery: string): { summary: string; mongoQuery: string } => {
    const query = userQuery.toLowerCase();

    if (query.includes("sales") || query.includes("revenue")) {
      return {
        summary: `Okay, I've queried the **sales** collection in MongoDB.

Here's what I found for Q3:
- **Total Revenue:** $1,450,230.00
- **Top Region:** East ($620,100.00)
- **Top Rep:** Jane Doe ($112,000.00)

**[Gemini Insight]**: This is a 15% increase in revenue compared to Q2.`,
        mongoQuery: `db.sales.aggregate([
  { $match: { quarter: "Q3", year: 2025 } },
  { $group: {
      _id: "$region",
      totalRevenue: { $sum: "$amount" }
  }},
  { $sort: { totalRevenue: -1 } }
])`,
      };
    } else if (query.includes("users") || query.includes("customers")) {
      return {
        summary: `Running a \`countDocuments\` on the **users** collection...

We gained **1,421 new users** in the last 30 days. This is a 5% decrease from the previous period.

**[Solana Audit]**: This query has been securely logged to the blockchain. TxID: 4a...f2e`,
        mongoQuery: `db.users.countDocuments({
  createdAt: {
    $gte: new Date(ISODate().getTime() - 30 * 24 * 60 * 60 * 1000)
  }
})`,
      };
    } else if (query.includes("products") || query.includes("inventory")) {
      return {
        summary: `Here are the top 3 most-viewed products this week:
1. SKU #40A-B: "Wireless Pro Headphones"
2. SKU #21C-F: "Mechanical Keyboard"
3. SKU #99D-A: "4K UHD Monitor"`,
        mongoQuery: `db.products.find({
  category: "electronics"
})
.sort({ viewCount: -1 })
.limit(3)`,
      };
    } else {
      return {
        summary: `I've processed your request: "*${userQuery}*".

The Gemini API translated this into a MongoDB aggregation pipeline and I've analyzed the results. The key takeaway is that performance is strong in the 'East' region but 'West' region engagement is down 8%.`,
        mongoQuery: `db.analytics.aggregate([
  { $match: { 
      timestamp: { $gte: new Date("2025-10-01") } 
  }},
  { $group: {
      _id: "$region",
      engagement: { $avg: "$score" }
  }},
  { $sort: { engagement: -1 } }
])`,
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Add typing indicator
    const typingId = `typing-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        text: "DataQuery AI is thinking...",
        sender: "bot",
        isLoading: true,
      },
    ]);

    // Simulate bot response
    setTimeout(() => {
      const { summary, mongoQuery } = simulateBotResponse(input);
      const responseId = `resp-${Date.now()}`;

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== typingId)
          .concat({
            id: responseId,
            text: summary,
            sender: "bot",
            mongoQuery,
            responseId,
          })
      );
      setIsTyping(false);
    }, 2000);
  };

  // ✅ NEW — Lets user proceed to Querypage
  const handleContinue = () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: "/Querypage" },
      });
    } else {
      navigate("/Querypage");
    }
  };

  return (
    <div className="flex h-[calc(100vh-73px)] w-full flex-col bg-secondary/30">

      {/* ✅ Continue Button */}
      <div className="flex justify-center p-4">
        <Button onClick={handleContinue}>
          {isAuthenticated ? "Go to Query Page" : "Log in to Continue"}
        </Button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6 lg:p-10 code-window">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="w-full border-t border-border bg-card p-4 shadow-lg">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ask anything about your data..."
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isTyping}
              className="gradient-primary h-12 w-12 rounded-full shadow-glow transition-all duration-300 hover:scale-110 hover:shadow-glow-lg"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
