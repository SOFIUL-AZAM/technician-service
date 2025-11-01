import React, { useEffect, useState } from "react";
import DashboardWrapper from "../dashboards/DashboardWrapper";
import { db, auth } from "../../firebase";
import { doc, getDoc, setDoc, collection, onSnapshot, updateDoc } from "firebase/firestore";

export default function TechnicianDashboard() {
  const [profile, setProfile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [work, setWork] = useState("");
  const [price, setPrice] = useState(0);
  const [bookings, setBookings] = useState([]);

  const workOptions = ["Plumber", "Electrician", "AC Repair", "Computer Repair"];

  // Fetch technician profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "technicians_pending", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setSubmitted(true);
        setApproved(data.approved || false);
        setRejected(data.rejected || false);
        setName(data.name || "");
        setPhone(data.phone || "");
        setWork(data.work || "");
        setPrice(data.price || 0);
      }
    };
    fetchProfile();
  }, []);

  // Fetch assigned bookings realtime
  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubscribe = onSnapshot(collection(db, "bookings"), snapshot => {
      const myBookings = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(b => b.technicianId === auth.currentUser.uid);
      setBookings(myBookings);
    });
    return () => unsubscribe();
  }, []);

  // Submit / resubmit profile
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    if (!name || !phone || !work) return alert("Please fill all fields");

    try {
      await setDoc(doc(db, "technicians_pending", auth.currentUser.uid), {
        name,
        phone,
        work,
        email: auth.currentUser.email,
        price,
        approved: false,
        rejected: false,
        submittedAt: new Date(),
      });
      setSubmitted(true);
      setRejected(false);
      alert("✅ Profile submitted! Waiting for admin approval.");
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting profile.");
    }
  };

  const startJob = async (bookingId) => {
    await updateDoc(doc(db, "bookings", bookingId), { status: "in_progress" });
  };

  const completeJob = async (bookingId) => {
    await updateDoc(doc(db, "bookings", bookingId), { status: "completed" });
  };

  const handleLogout = async () => {
    await auth.signOut();
    window.location.reload();
  };

  return (
    <DashboardWrapper title="Technician Dashboard" onLogout={handleLogout}>
      {/* Profile Section */}
      {!submitted || rejected ? (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Technician Profile</h2>
          {rejected && (
            <p className="text-red-600 font-semibold mb-2">
              ❌ Your profile was rejected. Please resubmit.
            </p>
          )}
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            {/* Work Dropdown */}
            <select
              className="w-full p-2 border rounded"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              required
            >
              <option value="">Select your Service</option>
              {workOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <input
              className="w-full p-2 border rounded"
              type="number"
              placeholder="Set Service Price"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              min={0}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Submit Profile
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-2xl font-bold mb-2">Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Work:</strong> {profile.work}</p>
          <p><strong>Price:</strong> ${profile.price}</p>
          <p>
            <strong>Status:</strong> {approved ? "Approved ✅" : "Pending ⏳"}
          </p>
        </div>
      )}

      {/* Assigned Bookings */}
      <h2 className="text-2xl font-bold mb-4">Your Assigned Jobs</h2>
      {bookings.length === 0 && <p>No assigned jobs yet.</p>}
      {bookings.map(b => (
        <div key={b.id} className="p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center mb-2">
          <div>
            <p><strong>Booking ID:</strong> {b.id}</p>
            <p><strong>Status:</strong> {b.status}</p>
            <p><strong>Price:</strong> ${b.price}</p>
          </div>
          <div className="flex gap-2">
            {approved && b.status === "pending_technician" && (
              <button
                onClick={() => startJob(b.id)}
                className="px-3 py-1 bg-sky-600 text-white rounded"
              >
                Start Job
              </button>
            )}
            {approved && b.status === "in_progress" && (
              <button
                onClick={() => completeJob(b.id)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </DashboardWrapper>
  );
}
