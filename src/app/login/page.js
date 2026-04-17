"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FCE4EC] flex justify-center items-center p-6">

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-[#F4C9D6] p-8 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold mb-6 text-center text-[#DF829D]">
          Welcome Back 🎀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-[#8A3F55]">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-1 text-[#8A3F55]">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DF829D] text-white py-3 rounded-xl font-semibold shadow hover:bg-[#c96f8a] transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-[#8A3F55]">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#DF829D] font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

