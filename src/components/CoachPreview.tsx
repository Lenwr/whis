import React from "react";
import { Link } from "react-router-dom";
import { Coach } from "./useCoachs";

interface CoachsPreviewProps {
  coachs: Coach[];
}

export default function CoachsPreview({ coachs }: CoachsPreviewProps) {
  return (
    <div className="bg-cyan-600 rounded-xl p-6 shadow-xl border border-white/20">
      <h2 className="text-xl font-bold text-white mb-4">Top Coachs</h2>

      <div className="flex flex-col gap-4">
        {coachs.slice(0, 3).map((coach) => (
          <div key={coach.id} className="flex items-center gap-4">
            <img
              src={coach.avatarUrl}
              alt={coach.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
            />
            <div>
              <p className="text-white font-semibold">{coach.name}</p>
              <p className="text-white/60 text-sm">
                {coach.students} élèves — ⭐ {coach.note.toFixed(1)}/5
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/coachs"
        className="inline-block mt-4 text-white hover:text-indigo-500 text-sm font-semibold underline"
      >
        Voir tous les coachs →
      </Link>
    </div>
  );
}
