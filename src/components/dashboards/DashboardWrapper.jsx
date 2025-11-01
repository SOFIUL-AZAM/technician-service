// src/dashboards/DashboardWrapper.jsx
import React, { useState, useEffect } from "react";

export default function DashboardWrapper({ title, children, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark/light mode
  const handleToggleMode = () => setDarkMode(!darkMode);

  // Apply dark class to body
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} transition-colors duration-300`}>
      {/* Header */}
      <header className={`flex justify-between items-center p-4 shadow-md ${darkMode ? "bg-gray-800" : "bg-sky-600"} text-white`}>
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMode}
            className={`px-3 py-1 rounded-md border ${darkMode ? "border-gray-400" : "border-white"} hover:bg-white hover:text-gray-800 transition`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
