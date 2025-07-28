"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/app/utils/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    loadProfile();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        {profile ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
