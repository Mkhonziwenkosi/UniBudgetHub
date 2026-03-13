"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import StatusBar from "@/components/StatusBar";
import Header from "@/components/Header";

import { Mail, Lock } from "lucide-react";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setMessage(data.error || "Invalid email or password.");
      }
    } catch {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#031924] text-white">
      <StatusBar />
      <Header title="" showBack />

      <div className="px-6 pt-8">
        <h1 className="text-4xl font-semibold">Sign In</h1>

        <form onSubmit={handleSignIn} className="mt-10 space-y-8">

          <div>
            <label className="block text-sm text-white/90 mb-2">
              Email Address
            </label>

            <div className="flex items-center border-b border-white/20 pb-3">
              <Mail size={18} className="mr-3 text-white/70" />

              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm placeholder:text-white/60 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/90 mb-2">
              Password
            </label>

            <div className="flex items-center border-b border-white/20 pb-3">
              <Lock size={18} className="mr-3 text-white/70" />

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm placeholder:text-white/60 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#1E73FF] py-4 text-center font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {message && (
            <p className="text-center text-sm text-red-400">
              {message}
            </p>
          )}

          <p className="text-center text-sm text-white/60">
            I’m a new user.{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-[#1E73FF] cursor-pointer"
            >
              Sign Up
            </span>
          </p>

        </form>
      </div>
    </main>
  );
}
