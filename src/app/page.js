"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/app/utils/api";

export default function HomePage() {
  const [exercises, setExercises] = useState([]);
  const [name, setName] = useState("");
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);
  const [message, setMessage] = useState("");
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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
          <h2 className="text-lg font-semibold mb-4">Your Past Workouts</h2>
          {pastWorkouts.length === 0 ? (
            <p className="text-gray-600">No workouts found.</p>
          ) : (
            pastWorkouts.map((session) => (
              <div key={session._id} className="mb-4">
                <p className="font-semibold text-gray-800">
                  {new Date(session.date).toLocaleDateString()}
                </p>
                <ul className="list-disc ml-6">
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
            ))
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
      </div>
    </ProtectedRoute>
  );
}
