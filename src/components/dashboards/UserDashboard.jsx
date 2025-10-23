// src/components/dashboards/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardWrapper from "./DashboardWrapper";
import UserProfile from "../profile/UserProfile";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      }
    };
    fetchUser();
  }, []);

  return (
    <DashboardWrapper title="User Dashboard">
      <h2 className="text-2xl font-semibold mb-4">Welcome, {userData?.name || "User"} 👋</h2>
      {userData && (
        <UserProfile
          initialData={userData}
          onUpdate={(updatedData) => setUserData(updatedData)}
        />
      )}
    </DashboardWrapper>
  );
}
