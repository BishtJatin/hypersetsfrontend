"use client";

import { useState, useEffect, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { format, parseISO } from "date-fns";
import api from "@/app/utils/api";

export default function HomePage() {
  const [exercises, setExercises] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [name, setName] = useState("");
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);
  const [message, setMessage] = useState("");
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const res = await api.get("/workouts");
      setPastWorkouts(res.data);
    } catch (err) {
      console.error("Failed to load workouts:", err);
    }
  };

  const loadSuggestions = async (exerciseName) => {
    try {
      const res = await api.get(`/progress/${exerciseName}`);
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      setSuggestions([]);
    }
  };

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index][field] = value;
    setSets(updatedSets);
  };

  const addSet = () => {
    setSets([...sets, { reps: "", weight: "" }]);
  };

  const handleAddExercise = async () => {
    if (!name.trim()) return alert("Enter exercise name");

    try {
      await api.post("/workouts", {
        date: new Date(),
        exercises: [{ name, sets }],
      });
      setMessage("Workout logged!");
      setName("");
      setSets([{ reps: "", weight: "" }]);
      loadWorkouts();
      loadSuggestions(name);
    } catch (err) {
      console.error(err);
      alert("Failed to save workout");
    }
  };

  const groupedWorkouts = useMemo(() => {
  const map = {};
  pastWorkouts.forEach((session) => {
    const dateObj = new Date(session.date);
    const dateKey = dateObj.toISOString().split("T")[0];
    const monthKey = dateKey.slice(0, 7); // e.g. 2025-07

    if (selectedMonth && monthKey !== selectedMonth) return;

    if (!map[dateKey]) map[dateKey] = [];
    map[dateKey].push(session);
  });
  return map;
}, [pastWorkouts, selectedMonth]);

const allMonths = useMemo(() => {
  const monthSet = new Set();
  pastWorkouts.forEach((session) => {
    const d = new Date(session.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthSet.add(key);
  });

  return Array.from(monthSet).sort((a, b) => (a > b ? -1 : 1)); // newest first
}, [pastWorkouts]);



  return (
    <ProtectedRoute>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🏋️ Welcome to Hyprsets Tracker</h1>
        <p className="mb-6">Track your sets, weights, and progress here.</p>

        {/* 💪 Add Exercise Form */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Add Exercise</h2>
          <input
            type="text"
            placeholder="Exercise name"
            className="border p-2 w-full mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {sets.map((set, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="Reps"
                className="border p-2 w-1/2"
                value={set.reps}
                onChange={(e) => handleSetChange(idx, "reps", e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                className="border p-2 w-1/2"
                value={set.weight}
                onChange={(e) => handleSetChange(idx, "weight", e.target.value)}
              />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
            <button
              onClick={addSet}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add another set
            </button>

            <button
              onClick={handleAddExercise}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow"
            >
              💾 Save Workout
            </button>
          </div>

          {message && <p className="text-green-600 mt-3">{message}</p>}
        </div>

      {/* 📅 Past Workouts */}
<div className="bg-gray-50 p-4 rounded shadow mb-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">Your Past Workouts</h2>
    {allMonths.length > 0 && (
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="">All Months</option>
        {allMonths.map((month) => (
          <option key={month} value={month}>
            {format(parseISO(`${month}-01`), "MMMM yyyy")}
          </option>
        ))}
      </select>
    )}
  </div>

  {Object.keys(groupedWorkouts).length === 0 ? (
    <p className="text-gray-600">No workouts found.</p>
  ) : (
    <div className="space-y-2">
      {Object.entries(groupedWorkouts).map(([date, sessions]) => (
        <button
          key={date}
          onClick={() => {
            setSelectedWorkout({ date, sessions });
            setShowModal(true);
          }}
          className="block w-full text-left p-3 bg-white hover:bg-blue-50 border rounded shadow-sm"
        >
          {new Date(date).toLocaleDateString()}
        </button>
      ))}
    </div>
  )}
</div>


        {/* 📈 Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">💡 Progress Suggestions</h2>
            <ul className="list-disc ml-6 text-sm">
              {suggestions.map((sug, idx) => (
                <li key={idx}>
                  Set {sug.set}: {sug.tip} (
                  {sug.previous.reps} reps × {sug.previous.weight}kg →{" "}
                  {sug.current.reps} reps × {sug.current.weight}kg)
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🪟 Modal */}
        {showModal && selectedWorkout && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
              <button
                onClick={() => {
                  setSelectedWorkout(null);
                  setShowModal(false);
                }}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>
              <h3 className="text-lg font-semibold mb-3">
                Workout on {new Date(selectedWorkout.date).toLocaleDateString()}
              </h3>
              {selectedWorkout.sessions.map((session, idx) => (
                <div key={session._id || idx} className="mb-4">
                  <ul className="list-disc ml-6 text-sm">
                    {session.exercises.map((ex, i) => (
                      <li key={i}>
                        <strong>{ex.name}:</strong>{" "}
                        {ex.sets.map((set, sIdx) => (
                          <span key={sIdx}>
                            {set.reps} reps × {set.weight}kg{", "}
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
