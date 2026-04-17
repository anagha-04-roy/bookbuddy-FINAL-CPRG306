"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FCE4EC] flex flex-col justify-center items-center p-6">

      <h1 className="text-5xl font-bold text-[#DF829D] mb-15 mt-[-40px]">
        BookBuddy
      </h1>

      <img
        src="/reading.jpg"
        alt="BookBuddy"
        className="w-100 h-100 object-cover rounded-2xl shadow-lg border border-[#F4C9D6]"
      />

      <p className="text-[#8A3F55] mt-8 text-xl">
        Your personal reading companion 🫂
      </p>

      <button
        onClick={() => router.push("/login")}
        className="mt-10 px-8 py-4 bg-[#DF829D] text-white rounded-full border border-[#B35A75] shadow-lg text-xl font-semibold hover:bg-[#c96f8a] transition"
      >
        Get Started →
      </button>
    </div>
  );
}
