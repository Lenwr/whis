import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

interface Player {
  id: string;
  displayName: string;
  level: number;
  xpTotal: number;
  classe: string;
}

export default function LeaderboardView() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const data: Player[] = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          displayName: d.displayName || "Anonyme",
          level: d.level || 0,
          xpTotal: d.xpTotal || 0,
          classe: d.classe || "Shinigami",
        };
      });

      // Tri décroissant par niveau puis XP
      data.sort((a, b) => b.level - a.level || b.xpTotal - a.xpTotal);

      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  return (
    <div className="max-w-screen mx-auto px-2">
      <h1 className="text-2xl my-4 font-bold text-cyan-700 text-center">
        🏆 Classement des Guerriers
      </h1>
      <div className="overflow-x-scroll">
        <table className="table w-[80%] overflow-x-scroll">
          <thead className="bg-cyan-700 text-white">
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Classe</th>
              <th>Niveau</th>
              <th>XP</th>
              <th>Rang</th>
            </tr>
          </thead>
          <tbody className="bg-white text-cyan-700">
            {players.map((player, index) => {
              const getRank = () => {
                if (player.classe === "Shinigami") {
                  if (player.xpTotal < 30) return "Étudiant";
                  if (player.xpTotal < 85) return "Shinigami";
                  if (player.xpTotal < 100) return "Division";
                  return "Officier";
                }
                if (player.classe === "Quincy") {
                  if (player.xpTotal < 5) return "Gemischt";
                  if (player.xpTotal < 15) return "Confirmé";
                  return "Echt";
                }
                return "Débutant";
              };

              return (
                <tr key={player.id} className="hover">
                  <td>{index + 1}</td>
                  <td>{player.displayName}</td>
                  <td>{player.classe}</td>
                  <td>{player.level}</td>
                  <td>{player.xpTotal}</td>
                  <td>{getRank()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
