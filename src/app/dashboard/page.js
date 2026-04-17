"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged} from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user
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

  // Load books
  useEffect(() => {
    if (!user) return;

    const booksRef = collection(db, "users", user.uid, "books");
    const q = query(booksRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBooks(list);
      setFilteredBooks(list);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // Search + Filter
  useEffect(() => {
    let results = books;

    if (filterStatus !== "All") {
      results = results.filter((book) => book.status === filterStatus);
    }

    if (searchTerm.trim() !== "") {
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(results);
  }, [searchTerm, filterStatus, books]);

  const toggleFavourite = async (bookId, currentValue) => {
    const bookRef = doc(db, "users", user.uid, "books", bookId);
    await updateDoc(bookRef, { favourite: !currentValue });
  };

  const deleteBook = async (bookId) => {
    await deleteDoc(doc(db, "users", user.uid, "books", bookId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-10 relative"
      style={{
        backgroundImage: "url('/book.jpg')",
        backgroundSize: "contain",
        backgroundPosition: "top center",
        backgroundRepeat: "repeat",
        backgroundColor: "#FCE4EC",
      }}
    >
      
      <div className="absolute  bg-[#FCE4EC]/20 backdrop-blur-sm"></div>

      {/* All content */}
      <div className="relative z-10">

        {/* HEADER */}
        <div
          className="p-8 rounded-b-3xl shadow-md text-white"
          style={{
            background: "linear-gradient(135deg, #DF829D, #F4C9D6)",
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white text-[#DF829D] rounded-full flex items-center justify-center text-xl font-bold shadow">
                {user?.displayName?.charAt(0).toUpperCase() || "U"}
              </div>

              <h1 className="text-2xl font-semibold">
                Hi, {user?.displayName || "Reader"}!
              </h1>
            </div>

            <button
              onClick={() => router.push("/favourites")}
              className="bg-white text-[#DF829D] px-4 py-2 rounded-full shadow hover:bg-[#FDECF1]"
            >
             <span className="text-4xl leading-none">♡</span>
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="p-4">
          <div className="bg-[#FCE4EC]/80 backdrop-blur-md border border-[#DF829D]/40 rounded-xl shadow p-3 flex items-center gap-3">
            <span className="text-[#DF829D] text-xl">📚</span>
            <input
              type="text"
              placeholder="Search books..."
              className="w-full bg-transparent outline-none text-[#B35A75] placeholder:[#B35A75]/70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex justify-around px-4 mb-4">
          {["All", "Reading", "Completed"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full font-medium backdrop-blur-md ${
                filterStatus === status
                  ? "bg-[#DF829D] text-white"
                  : "bg-[#FCE4EC]/80 border border-[#DF829D]/40 text-[#B35A75]"
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* BOOK LIST */}
        <div className="px-4 space-y-4">
          {filteredBooks.length === 0 && (
            <div className="text-center mt-20">
              <p className="text-white text-xl">No books found</p>
            </div>
          )}

          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white p-5 rounded-2xl shadow border border-[#F4C9D6]"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-[#DF829D] text-lg">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600">Author: {book.author}</p>
                  <p className="text-sm text-gray-600">Status: {book.status}</p>
                </div>

                {/* Favourite */}
                <div
                  className="text-2xl cursor-pointer"
                  onClick={() => toggleFavourite(book.id, book.favourite)}
                >
                  {book.favourite ? (
                    <span className="text-[#DF829D]">❤️</span>
                  ) : (
                    <span className="text-gray-500">♡</span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-[#F4C9D6] h-2 rounded">
                  <div
                    className="h-2 rounded bg-[#DF829D]"
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1 text-[#B35A75]">
                  {book.progress}% Completed
                </p>
              </div>

              {/* Edit/Delete */}
              <div className="flex justify-end space-x-4 mt-3">
                <button
                  className="text-[#DF829D] font-bold"
                  onClick={() => router.push(`/edit-book/${book.id}`)}
                >
                  Edit
                </button>

                <button
                  className="text-[#DF829D] font-bold"
                  onClick={() => deleteBook(book.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-[#F4C9D6] flex justify-around py-3 z-20">

        {/* HOME ICON */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex flex-col items-center text-[#DF829D]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 12l9-9 9 9v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" />
          </svg>
        </button>

        {/* ADD ICON */}
        <button
          onClick={() => router.push("/add-book")}
          className="flex flex-col items-center text-[#DF829D]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* PROFILE ICON */}
        <button
          onClick={() => router.push("/profile")}
          className="flex flex-col items-center text-[#DF829D]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

