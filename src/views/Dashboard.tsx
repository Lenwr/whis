import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import CoachsPreview from "../components/CoachPreview";
import { useCoachs } from "../components/useCoachs";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { coachs, loading: loadingCoachs } = useCoachs();

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!user) return <p className="text-center mt-10">Utilisateur non trouvé.</p>;

  const { displayName, classe, xpTotal, level, role } = user;
  const xpMax = 100 + level * 50;
  const xpPercent = Math.min(100, (xpTotal / xpMax) * 100);

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

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen py-6 flex flex-col items-center justify-center bg-gradient-to-b from-cyan-200 via-cyan-400 to-indigo-600 overflow-hidden text-gray-900 font-sans px-4">
      <h1 className="text-3xl font-extrabold mb-4 text-cyan-900 drop-shadow-sm">
        Bienvenue {displayName || "Guerrier"}
      </h1>

      <p className="italic text-base text-cyan-900 text-center mb-8 max-w-xl">
        Entraîne-toi pour gagner de l’XP et gravir les rangs de ta classe.
      </p>

      <div className="bg-white/40 backdrop-blur-md border border-cyan-300 rounded-2xl shadow-lg p-6 w-full max-w-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold text-cyan-900">Classe</p>
          <p className="text-2xl font-bold text-cyan-900">{classe}</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold text-cyan-900">Rang</p>
          <p className="text-2xl font-bold text-cyan-900">{rank}</p>
        </div>
        <div className="w-full md:w-2/5">
          <p className="text-lg font-semibold text-cyan-900 mb-2">XP</p>
          <div className="w-full h-6 bg-cyan-100 rounded-full overflow-hidden border border-cyan-300 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-700 ease-out"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="text-sm mt-1 text-cyan-900 text-right font-medium">
            {xpTotal} / {xpMax}
          </p>
        </div>
      </div>

      {/* ✅ Les élèves voient la liste des coachs */}
      {role !== "Maitre" && (
        <div className="w-full max-w-3xl mb-8">
          {loadingCoachs ? (
            <p>Chargement coachs...</p>
          ) : (
            <CoachsPreview coachs={coachs} />
          )}
        </div>
      )}

      {/* ✅ Boutons d'entraînement seulement pour les élèves */}
      {role !== "Maitre" && (
        <div className="bg-white/40 backdrop-blur-md border border-cyan-300 rounded-2xl shadow-lg p-6 w-full max-w-3xl flex flex-col md:flex-row md:justify-center md:space-x-6 space-y-4 md:space-y-0 mb-8">
          {[
            { label: "EMOM", icon: "⏳", path: "/emom" },
            { label: "Tabata", icon: "🔥", path: "/tabata" },
            { label: "Run", icon: "🏃🏾‍♂️", path: "/run" },
            { label: "Sessions", icon: "🧑🏾‍💻", path: "/available-sessions" },
          ].map(({ label, icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex items-center justify-center px-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-lg shadow-md transition"
            >
              <span className="text-3xl mr-3">{icon}</span> {label}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Coachs uniquement */}
      {role === "Maitre" && (
        <>
          <button
            onClick={() => navigate("/create-session")}
            className="mt-4 px-6 py-4 bg-indigo-700 text-white rounded-xl font-bold shadow hover:bg-indigo-800 transition"
          >
            🎥 Créer une session live
          </button>

          <button
            onClick={() => navigate("/dashboard-coach")}
            className="mt-4 px-6 py-4 bg-cyan-800 text-white rounded-xl font-bold shadow hover:bg-cyan-900 transition"
          >
            📅 Voir mes sessions (Coach)
          </button>
        </>
      )}
    </div>
  );
}
