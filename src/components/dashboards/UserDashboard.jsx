import React, { useEffect, useState } from "react";
import DashboardWrapper from "./DashboardWrapper";
import { db, auth } from "../../firebase";
import { collection, getDocs, addDoc, onSnapshot, doc, getDoc } from "firebase/firestore";

export default function UserDashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  // 🔹 Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      const snapshot = await getDocs(collection(db, "services"));
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchServices();

    // 🔹 Realtime bookings for logged-in user
    const unsubscribe = onSnapshot(collection(db, "bookings"), async snapshot => {
      const allBookings = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(b => b.userId === auth.currentUser.uid);

      // 🔹 Fetch technician details for each booking
      const withTechDetails = await Promise.all(
        allBookings.map(async b => {
          if (b.technicianId) {
            const techRef = doc(db, "technicians_pending", b.technicianId);
            const techSnap = await getDoc(techRef);
            if (techSnap.exists()) {
              const tech = techSnap.data();
              return { ...b, technicianName: tech.name, technicianPhone: tech.phone };
            }
          }
          return b;
        })
      );

      setBookings(withTechDetails);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Book a new service
  const handleBook = async () => {
    if (!selectedService) return alert("Please select a service first!");

    await addDoc(collection(db, "bookings"), {
      userId: auth.currentUser.uid,
      serviceId: selectedService,
      technicianId: null,
      status: "pending_admin",
      createdAt: new Date()
    });

    setSelectedService("");
    alert("✅ Service booked! Waiting for admin approval.");
  };

  const handleLogout = () => auth.signOut().then(() => window.location.reload());

  return (
    <DashboardWrapper title="User Dashboard" onLogout={handleLogout}>
      {/* Book a service */}
      <h2 className="text-2xl font-bold mb-4">Book a Service</h2>
      <div className="mb-4 flex gap-2">
        <select
          value={selectedService}
          onChange={e => setSelectedService(e.target.value)}
          className="px-2 py-1 border rounded flex-1"
        >
          <option value="">Select a Service</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} - {s.price} Tk
            </option>
          ))}
        </select>
        <button
          onClick={handleBook}
          className="px-4 py-1 bg-sky-600 text-white rounded hover:bg-sky-700"
        >
          Book Now
        </button>
      </div>

      {/* Show Bookings */}
      <h2 className="text-2xl font-bold mb-2">Your Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map(b => (
        <div
          key={b.id}
          className="p-3 bg-white dark:bg-gray-800 rounded shadow mb-2"
        >
          <p><strong>Booking ID:</strong> {b.id}</p>
          <p><strong>Status:</strong> {b.status}</p>

          {b.technicianId ? (
            <>
              <p><strong>Technician Name:</strong> {b.technicianName || "Loading..."}</p>
              <p><strong>Phone:</strong> {b.technicianPhone || "N/A"}</p>
            </>
          ) : (
            <p><strong>Technician:</strong> Not Assigned Yet</p>
          )}
        </div>
      ))}
    </DashboardWrapper>
  );
}
