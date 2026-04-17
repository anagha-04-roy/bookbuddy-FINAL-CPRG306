"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Create Firestore profile
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: name,
        lastName: "",
        email: email,
        phone: "",
      });

      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      router.push("/login");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FCE4EC] flex justify-center items-center p-6">

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-[#F4C9D6] p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6 text-center text-[#DF829D]">
          Create Your Account 
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-[#8A3F55]">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-[#8A3F55]">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-[#8A3F55]">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium text-[#8A3F55]">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter password"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
              Account created successfully!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DF829D] text-white py-3 rounded-xl font-semibold shadow hover:bg-[#c96f8a] transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-[#8A3F55]">
          Already have an account?{" "}
          <a href="/login" className="text-[#DF829D] font-semibold hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

