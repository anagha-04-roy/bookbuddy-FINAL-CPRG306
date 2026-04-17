"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "../../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState("");
  const [notes, setNotes] = useState("");

  // Check auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/login");
      else setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // Fetch book data
  useEffect(() => {
    if (!user) return;

    const fetchBook = async () => {
      const bookRef = doc(db, "users", user.uid, "books", id);
      const snap = await getDoc(bookRef);

      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title);
        setAuthor(data.author);
        setGenre(data.genre);
        setStatus(data.status);
        setProgress(data.progress);
        setNotes(data.notes);
      }

      setLoading(false);
    };

    fetchBook();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const bookRef = doc(db, "users", user.uid, "books", id);

    await updateDoc(bookRef, {
      title,
      author,
      genre,
      status,
      progress: Number(progress),
      notes,
      updatedAt: serverTimestamp(),
    });

    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading book...
      </div>
    );
  }

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

      <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-md border border-[#F4C9D6] p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#DF829D]">
          ✏️ Edit Book
        </h1>

        <form onSubmit={handleUpdate} className="space-y-4">

          <div>
            <label className="block font-medium mb-1 text-[#8A3F55]">Title</label>
            <input
              type="text"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#8A3F55]">Author</label>
            <input
              type="text"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#8A3F55]">Genre</label>
            <input
              type="text"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#8A3F55]">Status</label>
            <select
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select status</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
              <option value="Wishlist">Wishlist</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#8A3F55]">Progress (%)</label>
            <input
              type="number"
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#8A3F55]">Notes</label>
            <textarea
              className="w-full border border-[#F4C9D6] p-3 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#DF829D]"
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#DF829D] text-white py-3 rounded-xl font-semibold shadow hover:bg-[#c96f8a] transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
