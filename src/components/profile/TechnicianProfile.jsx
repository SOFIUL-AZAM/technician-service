import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function TechnicianProfile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [work, setWork] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "technicians_pending", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setPhone(data.phone || "");
        setWork(data.work || "");
        setSubmitted(true);
        setApproved(data.approved || false);
        setRejected(data.rejected || false);
      }
    };
    fetchStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !work) return alert("Please fill all fields");
    try {
      await setDoc(doc(db, "technicians_pending", auth.currentUser.uid), {
        name,
        phone,
        work,
        email: auth.currentUser.email,
        approved: false,
        rejected: false,
        submittedAt: new Date(),
      });
      setSubmitted(true);
      setRejected(false);
      alert("Profile submitted! Waiting for admin approval.");
    } catch (err) {
      console.error(err);
      alert("Error submitting profile.");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  if (approved) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center transition-colors">
        <h2 className="text-3xl font-bold mb-4 text-green-600 dark:text-green-400">✅ Profile Approved!</h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">Welcome {name}, you can now start accepting jobs.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Technician Profile</h2>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>

      {submitted && !rejected ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg">⏳ Profile submitted! Waiting for admin approval.</p>
      ) : rejected ? (
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-4">❌ Your profile was rejected. Please resubmit.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputFields name={name} setName={setName} phone={phone} setPhone={setPhone} work={work} setWork={setWork} />
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 transition"
            >
              Resubmit Profile
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputFields name={name} setName={setName} phone={phone} setPhone={setPhone} work={work} setWork={setWork} />
          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 transition"
          >
            Submit Profile
          </button>
        </form>
      )}
    </div>
  );
}

function InputFields({ name, setName, phone, setPhone, work, setWork }) {
  const inputClass = "mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-200";

  return (
    <>
      <div>
        <label className={labelClass}>Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
      </div>
      <div>
        <label className={labelClass}>Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
      </div>
      <div>
        <label className={labelClass}>Your Work/Service</label>
        <input type="text" value={work} onChange={(e) => setWork(e.target.value)} className={inputClass} required />
      </div>
    </>
  );
}
