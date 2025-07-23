import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface Session {
  id: string;
  coachId: string;
  coachName: string;
  title: string;
  dateTime: Timestamp;
  link: string;
  participants: string[];
}

export default function AvailableSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "sessions"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Session[];
        setSessions(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleJoinSession = async (sessionId: string) => {
    if (!user?.uid) return;
    const sessionRef = doc(db, "sessions", sessionId);
    try {
      await updateDoc(sessionRef, {
        participants: arrayUnion(user.uid),
      });
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, participants: [...s.participants, user.uid] } : s
        )
      );
      alert("Inscription réussie !");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-cyan-100 to-indigo-200">
      <h1 className="text-3xl font-bold text-center text-cyan-900 mb-8">
        Sessions Disponibles
      </h1>
      {loading ? (
        <p className="text-center text-gray-700">Chargement...</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {sessions.map((session) => {
            const isParticipant = session.participants.includes(user?.uid || "");

            return (
              <div
                key={session.id}
                className="bg-white shadow-lg rounded-xl p-6 border border-cyan-300"
              >
                <h2 className="text-xl font-bold text-indigo-800 mb-2">
                  {session.title}
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  📅 {session.dateTime.toDate().toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Coach : {session.coachName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  👥 Participants: {session.participants?.length || 0}
                </p>

                {isParticipant ? (
                  <a
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                  >
                    🔗 Rejoindre le live
                  </a>
                ) : (
                  <button
                    onClick={() => handleJoinSession(session.id)}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg"
                  >
                    🎫 S'inscrire à la session
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
