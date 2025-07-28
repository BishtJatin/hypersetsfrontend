"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/app/utils/api";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/leaderboard");
        setLeaders(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3 text-left">Rank</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Workout Sessions</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((user, idx) => (
                  <tr key={user.email} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-semibold">{idx + 1}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3 text-sm text-gray-700">{user.email}</td>
                    <td className="p-3">{user.sessionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
