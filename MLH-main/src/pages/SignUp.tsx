import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: after sign up, redirect to sign in to login
    navigate("/signin");
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Create an account</h2>
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
            <Button type="submit">Create account</Button>
            <Link to="/signin" className="text-sm text-primary hover:underline">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
