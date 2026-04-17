"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("Reading");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await addDoc(collection(db, "users", user.uid, "books"), {
        title,
        author,
        genre,
        status,
        progress: Number(progress),
        notes,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);

      // Clear form
      setTitle("");
      setAuthor("");
      setGenre("");
      setStatus("Reading");
      setProgress(0);
      setNotes("");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FCE4EC] p-6">

      {/* TOP BACK ARROW */}
      <button
        onClick={() => router.push("/dashboard")}
        className="text-[#B35A75] hover:text-[#DF829D] flex items-center gap-2 mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* FORM CARD */}
      <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-md">

        <h1 className="text-2xl font-semibold mb-6 text-center text-[#B35A75]">
          Add a New Book
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium text-[#B35A75]">Book Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#F4C9D6] bg-[#FFF0F5] rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter book title"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block mb-1 font-medium text-[#B35A75]">Author</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#F4C9D6] bg-[#FFF0F5] rounded-md"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Enter author name"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block mb-1 font-medium text-[#B35A75]">Genre</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#F4C9D6] bg-[#FFF0F5] rounded-md"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Optional"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium text-[#B35A75]">Reading Status</label>
            <select
              className="w-full px-3 py-2 border border-[#F4C9D6] bg-[#FFF0F5] rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
              <option value="Want to Read">Want to Read</option>
            </select>
          </div>

          {/* Progress */}
          <div>
            <label className="block mb-1 font-medium text-[#B35A75]">Progress (%)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-[#F4C9D6] bg-[#FFF0F5] rounded-md"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              min="0"
              max="100"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 font-medium text-[#B35A75]">Notes (optional)</label>
            <textarea
              className="w-full px-3 py-2 border border-[#F4C9D6] bg-[#FFF0F5] rounded-md"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add personal notes..."
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Success */}
          {success && (
            <p className="text-green-600 text-sm">Book added successfully!</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DF829D] text-white py-2 rounded-lg shadow hover:bg-[#B35A75] disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
