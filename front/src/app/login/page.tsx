"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Eye, EyeOff, ShieldCheck, ArrowRight, Watch, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:5000/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
      const payload = mode === "login" ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed. Please try again.");
      }

      // Save token and user details to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (mode === "login") {
        setSuccessMsg("Welcome back! Login successful. Gmail notification sent.");
      } else {
        setSuccessMsg("Account created successfully! Welcome email sent to your inbox.");
      }

      // Redirect to homepage after brief delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server. Make sure MongoDB backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-amber-500 selection:text-black relative overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-700/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navigation */}
      <header className="px-6 py-6 border-b border-neutral-800/60 backdrop-blur-md relative z-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <Watch className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <span className="font-serif text-xl tracking-wider uppercase font-semibold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Mankind Timepieces
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-neutral-400 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
        >
          Return to Boutique <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 my-8">
        <div className="w-full max-w-md bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80 relative">
          {/* Subtle Top Accent Border */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          {/* Title Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif tracking-tight font-light text-white mb-2">
              {mode === "login" ? "Access Your Collection" : "Join The Society"}
            </h1>
            <p className="text-xs text-neutral-400 tracking-wide">
              {mode === "login"
                ? "Enter your credentials to manage your timepieces"
                : "Create an account for exclusive horological access"}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-neutral-950/80 rounded-xl border border-neutral-800/80 mb-6 text-xs font-medium uppercase tracking-wider">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-lg transition-all ${
                mode === "login"
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-lg transition-all ${
                mode === "register"
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Notification Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-800/50 rounded-xl flex items-start gap-3 text-red-300 text-xs leading-relaxed animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-start gap-3 text-emerald-300 text-xs leading-relaxed animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-200">{successMsg}</p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">Automated n8n notification dispatched.</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Lord Alexander Vance"
                    className="w-full bg-neutral-950/90 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexander@mankind.com"
                  className="w-full bg-neutral-950/90 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-950/90 border border-neutral-800 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Connecting to Vault...</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Enter Vault" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-neutral-800/60 text-center flex items-center justify-center gap-2 text-[11px] text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
            <span>Encrypted horological authentication via MongoDB & n8n</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-600 border-t border-neutral-900 relative z-10">
        © {new Date().getFullYear()} Mankind Timepieces. All rights reserved.
      </footer>
    </div>
  );
}
