// 🧠 Composant LiveSessions (à intégrer dans Dashboard)
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export default function LiveSessions() {
  const [liveSessions, setLiveSessions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const now = new Date();
    const startWindow = new Date(now.getTime() - 10 * 60 * 1000); // 10 min avant
    const endWindow = new Date(now.getTime() + 60 * 60 * 1000); // 1h après

    const q = query(
      collection(db, "sessions"),
      where("date", ">=", startWindow),
      where("date", "<=", endWindow)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLiveSessions(sessions);
    });

    return () => unsubscribe();
  }, []);

  if (!user || user.role !== "Etudiant") return null;

  return (
    <div className="w-full max-w-3xl mt-4">
      <h2 className="text-2xl font-bold text-white mb-4">🔴 Sessions live en cours</h2>

      {liveSessions.length === 0 ? (
        <p className="text-white/80 italic">Aucune session active pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {liveSessions.map((session) => (
            <div key={session.id} className="bg-white/30 backdrop-blur p-4 rounded-xl border border-white/40">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <p className="text-xl font-semibold text-white mb-1">🎓 Coach: {session.coachName}</p>
                  <p className="text-white text-sm mb-1">📅 Heure: {new Date(session.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <a
                  href={session.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 md:mt-0 inline-block px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition"
                >
                  🔗 Rejoindre le live
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
