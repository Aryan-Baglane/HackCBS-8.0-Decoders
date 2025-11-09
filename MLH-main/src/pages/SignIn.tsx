import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: This repo doesn't include real auth. For demo we store a simple flag.
    localStorage.setItem("loggedIn", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          </div>

          <div className="flex items-center justify-between">
            <Button type="submit">Sign In</Button>
            <Link to="/signup" className="text-sm text-primary hover:underline">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
