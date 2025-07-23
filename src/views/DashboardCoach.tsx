import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Session {
  id: string;
  coachId: string;
  title: string;
  dateTime: Timestamp; // ✅ Correction ici
  visioLink?: string;
  participants?: string[];
}

export default function DashboardCoach() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    const fetchSessions = async () => {
      try {
        const q = query(
          collection(db, "sessions"),
          where("coachId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const sessionsList: Session[] = [];
        querySnapshot.forEach((doc) => {
          sessionsList.push({ id: doc.id, ...doc.data() } as Session);
        });

        setSessions(sessionsList);
      } catch (error) {
        console.error("Erreur lors du chargement des sessions du coach :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Chargement des sessions...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Mes sessions en tant que coach
      </h1>

      {sessions.length === 0 ? (
        <p className="text-center text-gray-700">Aucune session trouvée.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="bg-white shadow-md p-4 rounded-xl border border-indigo-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-indigo-700">{session.title}</h2>
                  <p className="text-black text-sm">
                    📅 Date : {session.dateTime.toDate().toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    👥 Participants : {session.participants?.length ?? 0}
                  </p>
                </div>
                {session.visioLink && (
                  <a
                    href={session.visioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    🔗 Lancer le live
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
