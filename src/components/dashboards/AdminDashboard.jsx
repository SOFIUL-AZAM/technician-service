import React, { useEffect, useState } from "react";
import DashboardWrapper from "./DashboardWrapper";
import { db, auth } from "../../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc
} from "firebase/firestore";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [pendingTechs, setPendingTechs] = useState([]);

  // 🔹 Fetch technicians & bookings
  useEffect(() => {
    // Realtime bookings
    const unsubscribeBookings = onSnapshot(collection(db, "bookings"), snapshot => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch technicians
    const fetchTechnicians = async () => {
      const snapshot = await getDocs(collection(db, "technicians_pending"));
      const allTechs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingTechs(allTechs.filter(t => !t.approved && !t.rejected));
      setTechnicians(allTechs.filter(t => t.approved));
    };

    fetchTechnicians();
    const interval = setInterval(fetchTechnicians, 10000);

    return () => {
      unsubscribeBookings();
      clearInterval(interval);
    };
  }, []);

  // 🔹 Approve Technician (Auto add/update in "services")
  const handleApproveTech = async (id) => {
    const techRef = doc(db, "technicians_pending", id);
    const techSnap = await getDoc(techRef);

    if (!techSnap.exists()) return alert("Technician not found!");

    const tech = techSnap.data();

    // ✅ 1. Approve technician
    await updateDoc(techRef, { approved: true, rejected: false });

    // ✅ 2. Add/update their service in "services" collection
    await setDoc(doc(db, "services", id), {
      name: tech.work,
      price: tech.price || 0,
      technicianId: id,
      technicianName: tech.name,
      technicianPhone: tech.phone,
      technicianEmail: tech.email,
      approved: true,
      createdAt: new Date(),
      status: "available"
    });

    alert(`✅ Technician ${tech.name} approved & service added!`);
  };

  // 🔹 Reject Technician
  const handleRejectTech = async (id) => {
    await updateDoc(doc(db, "technicians_pending", id), { approved: false, rejected: true });
  };

  // 🔹 Assign Technician to Booking
  const assignTechnician = async (bookingId, techId) => {
    if (!techId) return;
    await updateDoc(doc(db, "bookings", bookingId), {
      technicianId: techId,
      status: "pending_technician",
    });
  };

  const handleLogout = () => auth.signOut().then(() => window.location.reload());

  return (
    <DashboardWrapper title="Admin Dashboard" onLogout={handleLogout}>
      {/* Pending Technicians */}
      <h2 className="text-2xl font-bold mb-2">Pending Technicians</h2>
      <div className="space-y-2 mb-6">
        {pendingTechs.map(t => (
          <div
            key={t.id}
            className="p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center"
          >
            <div>
              <p><strong>{t.name}</strong> — {t.work}</p>
              <p className="text-sm text-gray-600">{t.phone}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApproveTech(t.id)}
                className="px-2 py-1 bg-green-600 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleRejectTech(t.id)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings */}
      <h2 className="text-2xl font-bold mb-2">Bookings</h2>
      <div className="space-y-2">
        {bookings.map(b => (
          <div
            key={b.id}
            className="p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center"
          >
            <div>
              <p><strong>ID:</strong> {b.id}</p>
              <p><strong>Status:</strong> {b.status}</p>
              <p><strong>Technician:</strong> {b.technicianId || "Not Assigned"}</p>
            </div>

            {b.status === "pending_admin" && (
              <select
                onChange={e => assignTechnician(b.id, e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="">Assign Technician</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </DashboardWrapper>
  );
}
