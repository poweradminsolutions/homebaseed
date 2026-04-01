"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        const returnTo = searchParams.get("returnTo") || "/";
        router.push(returnTo);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm p-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Sign In</h1>
      <p className="text-muted mb-8">
        Welcome back to The Homeschool Source
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-muted">Or continue with</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-primary-light disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={handleAppleLogin}
          disabled={loading}
          className="w-full px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-primary-light disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.05 13.5c-.91 0-1.64.46-2.05 1.27.72.84 1.15 1.96 1.15 3.23 0 .93-.14 1.8-.43 2.59.28.08.56.13.86.13 2.22 0 4-1.79 4-4s-1.78-4-4-4zm-1.26-4.33c.91 0 1.65.74 1.65 1.65s-.74 1.65-1.65 1.65-1.65-.74-1.65-1.65.74-1.65 1.65-1.65zm1.46-3.82C12.79 2 8 5.79 8 10.5c0 1.83.67 3.5 1.76 4.79-.06.2-.1.41-.1.63 0 1.38 1.12 2.5 2.5 2.5.68 0 1.31-.27 1.76-.71.89.66 2 1.08 3.18 1.08 1.31 0 2.52-.47 3.47-1.23.34.04.68.08 1.04.08 2.21 0 4-1.79 4-4 0-1.89-1.32-3.47-3.07-3.82.19-.61.3-1.25.3-1.91 0-3.71-3.79-7.5-7.5-7.5z" />
          </svg>
          Apple
        </button>
      </div>

      <p className="text-center text-sm text-muted">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-primary hover:text-primary-dark font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
