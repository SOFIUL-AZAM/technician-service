// src/components/profile/UserProfile.jsx
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function UserProfile({ initialData, onUpdate }) {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name,
        email: auth.currentUser.email,
        phone
      };

      await setDoc(doc(db, "users", auth.currentUser.uid), updatedData);
      setStatus("Profile updated successfully ✅");

      if (onUpdate) onUpdate(updatedData); // Update parent state
    } catch {
      setStatus("Error updating profile ❌");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Your Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={auth.currentUser.email}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">
          Update Profile
        </button>
      </form>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
