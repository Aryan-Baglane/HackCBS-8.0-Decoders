import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { NavLink } from "./NavLink";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: "/Querypage" },   // ✅ After login → redirect to Querypage
    });
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 shadow-sm backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2 group">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow transition-all duration-300 group-hover:scale-110">
            <Database className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">DataQuery AI</span>
        </NavLink>

        {/* Navigation Links */}
        {!isAuthenticated ? (
          <div className="flex items-center space-x-6">

            <a
              href="#features"
              className="hidden text-sm font-medium text-muted-foreground hover:text-primary transition-colors md:block"
            >
              Features
            </a>

            <a
              href="#tech-stack"
              className="hidden text-sm font-medium text-muted-foreground hover:text-primary transition-colors md:block"
            >
              Tech Stack
            </a>

            <a
              href="#use-cases"
              className="hidden text-sm font-medium text-muted-foreground hover:text-primary transition-colors md:block"
            >
              Use Cases
            </a>

            {/* ✅ Auth0 Login Button */}
            <Button
              onClick={handleLogin}
              className="gradient-primary-hover shadow-glow hover:shadow-glow-lg transition-all duration-300"
            >
              Log In
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            <NavLink to="/dashboard" className="text-sm font-medium">
              <span className="text-sm font-medium text-foreground">Dashboard</span>
            </NavLink>

            {/* ✅ Show user info */}
            <span className="text-sm font-medium text-foreground">
              Welcome, <span className="text-primary">{user?.name || "User"}</span>
            </span>

            {/* ✅ Auth0 Logout Button */}
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              Logout
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};
