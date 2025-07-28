"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import router
import api from "../utils/api";

export default function LoginPage() {
  const router = useRouter(); // ✅ Initialize router
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);

      // ✅ Save token to localStorage
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");

      // ✅ Redirect to homepage
      router.push("/");
    } catch (err) {
      alert(err?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to Hyprsets</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="border border-gray-300 p-2 rounded"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="border border-gray-300 p-2 rounded"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
