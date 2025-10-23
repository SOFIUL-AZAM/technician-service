// HeroBanner.jsx
import React, { useState, useEffect } from "react";
import { Search, MapPin, Wrench, Zap, Fan, Cpu, Plug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import AuthForm from "./AuthForm";

export default function HeroBanner() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [technicianLocation, setTechnicianLocation] = useState({ lat: 0, lng: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [technicians, setTechnicians] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTechnicianLocation({
        lat: (Math.random() * 0.1 + 23.8103).toFixed(6),
        lng: (Math.random() * 0.1 + 90.4125).toFixed(6)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setTimeout(() => {
      const filtered = technicians.filter(t =>
        t.service.toLowerCase().includes(service.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 1000);
  };
  const handleCategoryClick = (category) => setService(category);
  const handleEmergency = () => alert("🚨 Emergency request sent!");

  return (
    <>
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#home" className="text-xl font-bold text-sky-600">TechService</a>
          <nav className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
            <a href="#home" className="hover:text-sky-600">Home</a>
            <a href="#services" className="hover:text-sky-600">Services</a>
            <a href="#how-it-works" className="hover:text-sky-600">How It Works</a>
            <a href="#contact" className="hover:text-sky-600">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <select className="border border-slate-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option>English</option>
              <option>বাংলা</option>
            </select>
            <button
              onClick={() => { setIsLoginMode(true); setShowAuthModal(true); }}
              className="px-3 py-1 text-sm font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700"
            >
              Login / Register
            </button>
          </div>
        </div>
      </header>

      {showAuthModal && (
        <Modal onClose={() => setShowAuthModal(false)}>
          <AuthForm
            isLogin={isLoginMode}
            onSuccess={(role) => {
              setShowAuthModal(false);
              if (role === "Admin") navigate("/admin");
              else if (role === "Technician") navigate("/technician");
              else navigate("/user");
            }}
          />
        </Modal>
      )}

      <section id="home" className="relative overflow-hidden min-h-screen bg-slate-50 flex flex-col justify-center pt-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-full -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mx-auto max-w-3xl text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Find trusted <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">technicians</span> near you
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base md:text-lg text-slate-600">
            Electrician, plumber, AC or computer repair — book in minutes and track live arrival.
          </p>

          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border-2 border-slate-300 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
            <form onSubmit={handleSearch} className="grid gap-3 grid-cols-1 sm:grid-cols-[1.2fr_1fr_auto]">
              <label className="group relative flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-sky-500">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none text-sm sm:text-base"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                />
              </label>
              <label className="group relative flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-sky-500">
                <MapPin className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your area or city"
                  className="w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none text-sm sm:text-base"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
              <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 sm:px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-sky-700 text-sm sm:text-base">
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 px-1 pb-1">
              <span className="text-xs text-slate-500">Quick categories:</span>
              <CategoryPill icon={<Wrench className="h-4 w-4" />} label="Plumber" onClick={() => handleCategoryClick("Plumber")} />
              <CategoryPill icon={<Plug className="h-4 w-4" />} label="Electrician" onClick={() => handleCategoryClick("Electrician")} />
              <CategoryPill icon={<Fan className="h-4 w-4" />} label="AC Repair" onClick={() => handleCategoryClick("AC Repair")} />
              <CategoryPill icon={<Cpu className="h-4 w-4" />} label="Computer Repair" onClick={() => handleCategoryClick("Computer Repair")} />
            </div>
          </div>

          <div className="mt-6">
            {loading && <p className="text-center text-slate-500">Searching...</p>}
            {!loading && results.length > 0 && (
              <ul className="max-w-2xl mx-auto space-y-2">
                {results.map((r) => (
                  <li key={r.id} className="p-3 border-2 border-slate-300 rounded-lg flex justify-between bg-white shadow-sm hover:shadow-md transition">
                    <span>{r.name}</span>
                    <span className="text-slate-500">{r.distance}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            Live Technician Location: {technicianLocation.lat}, {technicianLocation.lng}
          </div>
        </div>

        <button
          className="group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-300/40 ring-rose-500/20 transition hover:bg-rose-700"
          onClick={handleEmergency}
          aria-label="Request Emergency Service"
        >
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" aria-hidden="true" />
          Emergency Service
        </button>
      </section>
    </>
  );
}

function CategoryPill({ icon, label, onClick }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-300 bg-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
