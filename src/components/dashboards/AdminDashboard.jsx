import React, { useEffect, useState } from "react";
import DashboardWrapper from "./DashboardWrapper";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [technicians, setTechnicians] = useState([]);

  const fetchTechnicians = async () => {
    const snapshot = await getDocs(collection(db, "technicians_pending"));
    const techs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTechnicians(techs);
  };

  useEffect(() => { fetchTechnicians(); }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "technicians_pending", id), { approved: true, rejected: false });
    fetchTechnicians();
  };

  const handleReject = async (id) => {
    await updateDoc(doc(db, "technicians_pending", id), { approved: false, rejected: true });
    fetchTechnicians();
  };

  const handleLogout = () => auth.signOut().then(() => window.location.reload());

  return (
    <DashboardWrapper title="Admin Dashboard" onLogout={handleLogout}>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Technician Submissions</h2>
      <div className="space-y-4">
        {technicians.map(t => (
          <div key={t.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex justify-between items-center transition-colors">
            <div className="text-gray-800 dark:text-gray-100">
              <p><strong>Name:</strong> {t.name}</p>
              <p><strong>Email:</strong> {t.email}</p>
              <p><strong>Phone:</strong> {t.phone}</p>
              <p><strong>Work:</strong> {t.work}</p>
              <p><strong>Status:</strong> 
                {t.approved ? <span className="text-green-600 dark:text-green-400"> Approved ✅</span> :
                 t.rejected ? <span className="text-red-600 dark:text-red-400"> Rejected ❌</span> :
                 <span className="text-gray-600 dark:text-gray-300"> Pending ⏳</span>}
              </p>
            </div>
            <div className="flex gap-2">
              {!t.approved && !t.rejected && (
                <>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    onClick={() => handleApprove(t.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    onClick={() => handleReject(t.id)}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardWrapper>
  );
}
