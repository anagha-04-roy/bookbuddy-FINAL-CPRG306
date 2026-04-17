"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [tempProfile, setTempProfile] = useState({});

  // Load user + profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);

        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data());
        }

        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const startEditing = () => {
    setTempProfile(profile);
    setEditing(true);
  };

  const cancelEditing = () => {
    setProfile(tempProfile);
    setEditing(false);
  };

  const saveChanges = async () => {
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, profile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCE4EC]">

      {/* TOP BACK ARROW */}
      <div className="p-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[#B35A75] hover:text-[#DF829D] flex items-center gap-2"
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
      </div>

      {/* HEADER */}
      <div
        className="p-8 rounded-b-3xl shadow-md"
        style={{
          background: "linear-gradient(135deg, #DF829D, #F4C9D6)",
        }}
      >
        <div className="flex flex-col items-center text-white">

          {/* Avatar */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-[#DF829D]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold mt-4">
            {profile.firstName || "Your Name"}
          </h1>

          {/* Edit Button */}
          {!editing && (
            <button
              onClick={startEditing}
              className="mt-4 px-6 py-2 bg-white text-[#DF829D] font-semibold rounded-full shadow hover:bg-[#FDECF1]"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-2xl shadow-md">

        {/* FIELD COMPONENT */}
        {[
          { label: "First Name", key: "firstName" },
          { label: "Last Name", key: "lastName" },
          { label: "Email", key: "email", readonly: true },
          { label: "Phone Number", key: "phone" },
        ].map((field) => (
          <div key={field.key} className="mb-5">
            <label className="block text-[#B35A75] font-medium mb-1">
              {field.label}
            </label>

            {editing && !field.readonly ? (
              <input
                type="text"
                className="w-full border border-[#F4C9D6] bg-[#FFF0F5] p-2 rounded-md"
                value={profile[field.key]}
                onChange={(e) =>
                  setProfile({ ...profile, [field.key]: e.target.value })
                }
              />
            ) : (
              <p className="text-lg text-[#2D2D2D]">
                {profile[field.key] || "—"}
              </p>
            )}
          </div>
        ))}

        {/* BUTTONS */}
        {editing ? (
          <div className="flex gap-3 mt-6">
            <button
              onClick={saveChanges}
              className="flex-1 bg-[#DF829D] text-white py-2 rounded-lg shadow hover:bg-[#B35A75]"
            >
              Save
            </button>

            <button
              onClick={cancelEditing}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg shadow hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-[#DF829D] text-white py-2 rounded-lg shadow hover:bg-[#B35A75]"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
