import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface UserData {
  uid: string;
  displayName: string;
  anime?: string;
  classe: string;
  xpTotal: number;
  level: number;
  createdAt: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data() as UserData;
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Erreur récupération données utilisateur :", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  if (!userData) return <p className="text-center mt-10">Utilisateur non trouvé.</p>;

  const { displayName, classe, xpTotal, level } = userData;

  // Calcul dynamique du XP max selon le niveau
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
    <div className="relative min-h-screen bg-gradient-to-b from-blue-300 via-cyan-200 to-blue-500 overflow-hidden text-gray-900 font-sans">
      {/* Salle du Temps background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-70"
        // tu peux ajouter un background-image ici si tu veux
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/60" />

      <div className="relative z-10 max-w-6xl mx-auto p-6 flex flex-col items-center space-y-8">
        {/* Bienvenue */}
        <div className="bg-cyan-100 bg-opacity-80 border border-cyan-300 rounded-xl items-center px-3 py-3 drop-shadow-md text-center max-w-md w-full flex flex-row justify-center ">
          <h1 className=" text-xl font-semibold tracking-wide text-cyan-700 mr-2 drop-shadow-sm">
            Bienvenue
          </h1>
          <p className=" text-2xl font-extrabold  text-cyan-800">
            {displayName || "Guerrier"}
          </p>
        </div>

        <p className="italic text-base text-cyan-900 max-w-xl text-center drop-shadow-sm">
          Entraîne-toi pour gagner de l’XP et gravir les rangs dans ta classe.
        </p>

        {/* Stats */}
        <div className="bg-white/40 backdrop-blur-md rounded-xl p-8 w-full max-w-3xl shadow-lg border border-cyan-300">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 text-cyan-900">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold">Classe actuelle</p>
              <p className="text-2xl font-bold">{classe}</p>
            </div>

            <div className="text-center md:text-left">
              <p className="text-lg font-semibold">Rang actuel</p>
              <p className="text-2xl font-bold">{rank}</p>
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
                {xpTotal} / {xpMax}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 max-w-3xl w-full flex flex-col md:flex-row md:justify-center md:space-x-6 space-y-4 md:space-y-0 shadow-md border border-cyan-300">
          {[
            { label: "EMOM", icon: "⏳", path: "/emom" },
            { label: "Tabata", icon: "🔥", path: "/tabata" },
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
      </div>
    </div>
  );
}
