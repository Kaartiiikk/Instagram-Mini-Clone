import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { AuthResponse } from "@shared/schema";
import SplashScreen from "@/components/splash-screen";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSplash, setShowSplash] = useState(false);

  const signupMutation = useMutation({
    mutationFn: () => apiRequest<AuthResponse>("POST", "/api/auth/signup", { username, password }),
    onSuccess: (data) => {
      setAuth(data);
      setShowSplash(true);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    signupMutation.mutate();
  };

  const handleSplashComplete = () => {
    setLocation("/");
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={2000} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center" data-testid="text-signup-title">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              data-testid="input-username"
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              data-testid="input-password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              data-testid="input-confirm-password"
              required
            />
          </div>
          {error && <p className="text-destructive text-sm" data-testid="text-error">{error}</p>}
          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full py-2 bg-secondary text-secondary-foreground rounded-md"
            data-testid="button-signup"
          >
            {signupMutation.isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline" data-testid="link-login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
