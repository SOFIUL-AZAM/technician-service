// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HeroBanner from "./components/HeroBanner";
import Footer from "./components/Footer";
import MainSectionTabs from "./components/MainSectionTabs";
import AuthForm from "./components/AuthForm";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import TechnicianProfile from "./components/profile/TechnicianProfile";
import UserDashboard from "./components/dashboards/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroBanner />
              <MainSectionTabs />
              <Footer />
            </>
          }
        />
        <Route path="/auth" element={<AuthForm />} />

        {/* Dashboards */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician"
          element={
            <ProtectedRoute allowedRoles={["Technician"]}>
              <TechnicianProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
