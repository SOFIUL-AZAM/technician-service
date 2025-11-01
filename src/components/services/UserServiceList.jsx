// src/pages/UserServiceList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function UserServiceList() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const q = query(collection(db, "services"), where("approved", "==", true));
      const snapshot = await getDocs(q);
      const serviceList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(serviceList);
    };
    fetchServices();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-lg"
          >
            <h3 className="font-semibold text-lg">{s.name}</h3>
            <p>Technician: {s.technicianName}</p>
            <p>Price: {s.price}৳</p>
            <p>Status: {s.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
