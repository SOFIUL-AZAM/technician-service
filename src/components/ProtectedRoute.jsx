// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (docSnap.exists()) setRole(docSnap.data().role);
      setLoading(false);
    };
    fetchRole();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  if (!role || !allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
}
