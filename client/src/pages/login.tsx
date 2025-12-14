import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { AuthResponse } from "@shared/schema";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => apiRequest<AuthResponse>("POST", "/api/auth/login", { username, password }),
    onSuccess: (data) => {
      setAuth(data);
      setLocation("/");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center" data-testid="text-login-title">Mini-Instagram</h1>
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
            />
          </div>
          {error && <p className="text-destructive text-sm" data-testid="text-error">{error}</p>}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-2 bg-secondary text-secondary-foreground rounded-md"
            data-testid="button-login"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-foreground underline" data-testid="link-signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
