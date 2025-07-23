import React from "react";
import { useCoachs } from "../components/useCoachs";

export default function CoachsList() {
  const { coachs, loading } = useCoachs();

  if (loading) {
    return <p className="text-center mt-10 text-white">Chargement...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-cyan-800 via-indigo-900 to-black text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-center">Nos Coachs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {coachs.map((coach) => (
          <div
            key={coach.id}
            className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105"
          >
            <img
              src={coach.avatarUrl}
              alt={coach.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white/30"
            />
            <h2 className="text-xl font-bold mb-1">{coach.name}</h2>
            <p className="text-sm text-white/70">{coach.students} élèves</p>
            <p className="text-sm text-yellow-400 mt-1">
              ⭐ {coach.note.toFixed(1)} / 5
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
