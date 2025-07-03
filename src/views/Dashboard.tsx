import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

interface DashboardProps {
  displayName?: string;
  level?: number; // facultatif, par défaut 0
  xp?: number; // facultatif, par défaut 0
  xpMax?: number; // facultatif, par défaut 100
  classe?: string; // nouvelle propriété => choisie à l'inscription
}

export default function Dashboard({
  displayName,
  level = 0,
  xp = 0,
  xpMax = 100,
  classe = "Shinigami", // exemple par défaut
}: DashboardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const xpPercent = Math.min(100, (xp / xpMax) * 100);

  // Exemple mapping Bleach : Shinigami
  const getRank = (level: number, classe: string): string => {
    if (classe === "Shinigami") {
      if (level < 5) return "Étudiant de l'Académie";
      if (level < 15) return "Shinigami de base";
      if (level < 30) return "Membre de Division";
      return "Officier de Division";
    }
    if (classe === "Quincy") {
      if (level < 5) return "Ordinaires / Sang-Mêlé (Gemischt)";
      if (level < 15) return "Quincy confirmé";
      return "Sang Pur (Echt)";
    }
    return "Débutant";
  };

  const rank = getRank(level, classe);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-300 via-cyan-200 to-blue-500 overflow-hidden text-gray-900 font-sans">
      {/* Salle du Temps background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-70"
        style={{ backgroundImage: "url('/SDT.jpeg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/60" />

      <div className="relative z-10 max-w-6xl mx-auto p-6 flex flex-col items-center space-y-8">
        {/* Bienvenue */}
        <div className="bg-cyan-100 bg-opacity-80 border border-cyan-300 rounded-xl px-6 py-3 drop-shadow-md text-center max-w-md w-full">
          <h1 className="text-2xl font-extrabold tracking-wide text-cyan-700 drop-shadow-sm">
            Bienvenue dans la Salle du Temps
          </h1>
          <p className="mt-1 text-xl font-semibold text-cyan-800">
            {displayName || user?.displayName || "Guerrier"}
          </p>
        </div>

        <p className="italic text-base text-cyan-900 max-w-xl text-center drop-shadow-sm">
          Entraîne-toi pour gagner de l’XP et gravir les rangs dans ta classe.
        </p>

        {/* Stats */}
        <div className="bg-white/40 backdrop-blur-md rounded-xl p-8 w-full max-w-3xl shadow-lg border border-cyan-300">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 text-cyan-900">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold">Classe</p>
              <p className="text-3xl font-bold">{classe}</p>
            </div>

            <div className="text-center md:text-left">
              <p className="text-lg font-semibold">Rang</p>
              <p className="text-3xl font-bold">{rank}</p>
            </div>

            <div className="w-full md:w-2/5">
              <p className="text-lg font-semibold mb-2">XP</p>
              <div className="w-full h-6 bg-cyan-100 rounded-full overflow-hidden shadow-inner border border-cyan-300">
                <div
                  className="h-6 bg-cyan-500 transition-all duration-700 ease-out"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <p className="text-sm mt-1 text-cyan-700 text-right font-medium">
                {xp} / {xpMax}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 max-w-3xl w-full flex flex-col md:flex-row md:justify-center md:space-x-6 space-y-4 md:space-y-0 shadow-md border border-cyan-300">
          {[
            { label: "EMOM", icon: "⏳", path: "/emom" },
            { label: "Séances", icon: "💪", path: "/seances" },
            { label: "Tabata", icon: "🔥", path: "/tabata" },
            { label: "Vélo", icon: "🚴", path: "/velo" },
            { label: "Autres", icon: "⚔️", path: "/autres" },
          ].map(({ label, icon, path }) => (
            <button
              key={label}
              className="flex items-center justify-center bg-cyan-700 hover:bg-cyan-600 rounded-lg py-4 text-white font-semibold text-lg transition"
              onClick={() => navigate(path)}
            >
              <span className="text-3xl mr-3">{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="flex flex-row items-center justify-center bg-cyan-700 hover:bg-cyan-600 rounded-lg px-4 py-2"
        >
          <p className="text-m text-white">Quitter la salle du temps</p>
          <button className="text-4xl ml-2 text-cyan-700">🚪</button>
        </div>
      </div>
    </div>
  );
}
