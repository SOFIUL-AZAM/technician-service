import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function AuthForm({ isLogin, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // default role

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role,
        name: "",
      });

      alert("Signup successful! You can now login.");
      // Automatically switch to login mode
      onSuccess("toggle");
    } catch (err) {
      console.error(err);
      alert("Error during signup: " + err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch role from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        alert("No user data found!");
        return;
      }

      const userData = docSnap.data();
      const userRole = userData.role;

      // Call onSuccess with role
      onSuccess(userRole);

    } catch (err) {
      console.error(err);
      alert("Login failed: " + err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");
    if (isLogin) handleLogin();
    else handleSignup();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-700">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="User">User</option>
              <option value="Technician">Technician</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => onSuccess("toggle")}
          className="text-sky-600 hover:underline"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
