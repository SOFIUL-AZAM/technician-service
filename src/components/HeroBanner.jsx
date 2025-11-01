import React, { useState, useEffect } from "react";
import { Wrench, Plug, Fan, Cpu, Zap } from "lucide-react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import AuthForm from "./AuthForm";

export default function HeroBanner() {
  const [service, setService] = useState("");
  const [results, setResults] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState("");
  const [pendingTech, setPendingTech] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch approved technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const q = query(
          collection(db, "technicians_pending"),
          where("approved", "==", true)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTechnicians(list);
      } catch (err) {
        console.error("Firestore fetch error:", err);
      }
    };
    fetchTechnicians();
  }, []);

  // 🔍 Search technicians
  const handleSearch = (e) => {
    e.preventDefault();
    if (!service.trim()) {
      setResults([]);
      return;
    }
    const filtered = technicians.filter(
      (t) =>
        (t.work && t.work.toLowerCase().includes(service.trim().toLowerCase())) ||
        (t.technicianName &&
          t.technicianName.toLowerCase().includes(service.trim().toLowerCase()))
    );
    setResults(filtered);
  };

  // 🧾 Book Now → always show modal
  const handleBookService = (tech) => {
    setPendingTech(tech);
    setIsLoginMode(true);
    setShowAuthModal(true);
  };

  // ✅ Auth state listener → submit pending booking safely
  useEffect(() => {
    if (!pendingTech) return;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await addDoc(collection(db, "bookings"), {
            userId: user.uid,
            userEmail: user.email,
            technicianId: pendingTech.id,
            technicianName: pendingTech.technicianName,
            service: pendingTech.work,
            status: "pending_admin",
            createdAt: new Date(),
          });
          setMessage(`✅ Booking sent to ${pendingTech.technicianName}`);
          setPendingTech(null);
          setTimeout(() => setMessage(""), 3000);
        } catch (err) {
          console.error("Booking error:", err);
          alert("Booking failed! Try again.");
        }
        unsubscribe();
      }
    });
  }, [pendingTech]);

  const handleCategoryClick = (category) => setService(category);
  const handleEmergency = () => alert("🚨 Emergency request sent!");

  return (
    <>
      {/* Header */}
      <header className="w-full bg-white shadow-md fixed top-0 left-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a
            href="#home"
            className="text-2xl font-bold text-sky-600 hover:text-sky-700 transition"
          >
            TechService
          </a>
          <div>
            <button
              onClick={() => {
                setIsLoginMode(true);
                setShowAuthModal(true);
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-md shadow hover:bg-sky-700 transition"
            >
              Login / Register
            </button>
          </div>
        </div>
      </header>

      {/* 🔐 Auth Modal */}
      {showAuthModal && (
        <Modal onClose={() => setShowAuthModal(false)}>
          <AuthForm
            isLogin={isLoginMode}
            onSuccess={(role) => {
              if (role === "toggle") {
                setIsLoginMode(!isLoginMode);
                return;
              }

              setShowAuthModal(false);

              if (role === "Admin") navigate("/admin");
              else if (role === "Technician") navigate("/technician");
              else navigate("/user");

              // ✅ pendingTech automatically handled by useEffect
            }}
          />
        </Modal>
      )}

      {/* 🧰 Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col justify-center pt-28 px-4">
        <div className="mx-auto max-w-5xl text-center bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-md border border-slate-200">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            Find trusted <span className="text-sky-600">technicians</span> near you
          </h1>
          <p className="text-slate-600 mb-6 text-lg sm:text-xl">
            Quick, reliable, and skilled professionals at your doorstep.
          </p>

          {/* 🔍 Search */}
          <form
            onSubmit={handleSearch}
            className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-[1.5fr_auto] gap-3 mb-6"
          >
            <input
              type="text"
              placeholder="Search service..."
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-md px-6 py-3 font-medium transition"
            >
              Search
            </button>
          </form>

          {/* 🧩 Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <CategoryPill icon={<Wrench />} label="Plumber" onClick={() => handleCategoryClick("Plumber")} />
            <CategoryPill icon={<Plug />} label="Electrician" onClick={() => handleCategoryClick("Electrician")} />
            <CategoryPill icon={<Fan />} label="AC Repair" onClick={() => handleCategoryClick("AC Repair")} />
            <CategoryPill icon={<Cpu />} label="Computer Repair" onClick={() => handleCategoryClick("Computer Repair")} />
          </div>

          {/* 🔎 Search Results */}
          {results.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((t) => (
                <li
                  key={t.id}
                  className="bg-white border border-slate-200 rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
                >
                  <div>
                    <p className="font-semibold text-lg text-slate-800">{t.technicianName}</p>
                    <p className="text-slate-500">{t.work}</p>
                    <p className="text-sky-600 font-semibold mt-1">${t.price}</p>
                  </div>
                  <button
                    onClick={() => handleBookService(t)}
                    className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition"
                  >
                    Book Now
                  </button>
                </li>
              ))}
            </ul>
          )}

          {results.length === 0 && service && (
            <p className="text-slate-500 italic mt-6">No matching technicians found.</p>
          )}

          {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
        </div>

        {/* 🚨 Emergency Button */}
        <button
          onClick={handleEmergency}
          className="fixed bottom-6 right-6 bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-lg transition"
        >
          <Zap className="h-5 w-5 animate-pulse" /> Emergency Service
        </button>
      </section>
    </>
  );
}

// 💠 Category Pill
function CategoryPill({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 border border-slate-300 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 hover:scale-105 transition"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
