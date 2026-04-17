"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function FavouritesPage() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) window.location.href = "/login";
      else setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const booksRef = collection(db, "users", user.uid, "books");
    const q = query(booksRef, where("favourite", "==", true));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(list);
    });

    return () => unsub();
  }, [user]);

  return (
    <div
      className="min-h-screen p-6 relative"
      style={{
        backgroundImage: "url('/book.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#FCE4EC",
      }}
    >
      {/* Soft overlay */}
      <div className="absolute  bg-[#FCE4EC]/70 backdrop-blur-sm"></div>

      <div className="relative z-10">

        {/* BACK ARROW */}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[#DF829D] text-5xl mb-5"
        > 
          ← 
        </button>
       
        <h1 className="text-4xl font-bold mb-8 text-[#DF829D]">
          ❤️ Your Favourite Books
        </h1>

        {books.length === 0 && (
          <p className="text-white text-xl">No favourite books yet.</p>
        )}

        <div className="space-y-5">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white/90 backdrop-blur-md border border-[#F4C9D6] p-6 rounded-2xl shadow-lg"
            >
              <h3 className="font-bold text-[#DF829D] text-xl mb-1">
                {book.title}
              </h3>
              <p className="text-md text-[#8A3F55]">
                Author: {book.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
