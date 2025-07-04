import React, { useState } from "react";
import EMOM from "../components/Emom";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export default function EmomView() {
  const [minutes, setMinutes] = useState("1");
  const [seconds, setSeconds] = useState("0");
  const [rounds, setRounds] = useState("10");
  const [started, setStarted] = useState(false);
  const { user } = useAuth();

  const totalDuration = Number(minutes || "0") * 60 + Number(seconds || "0");
  const totalRounds = Number(rounds || "0");

  const startEMOM = () => setStarted(true);
  const resetEMOM = () => setStarted(false);

  const handleComplete = async () => {
    const totalMinutes = Math.floor((totalDuration * totalRounds) / 60);
    alert(`EMOM terminé, bravo ! Tu as gagné ${totalMinutes} XP.`);

    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          xpTotal: increment(totalMinutes),
        });
      } else {
        await setDoc(userRef, {
          xpTotal: totalMinutes,
        });
      }
    }

    resetEMOM();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-300 via-black-200 to-blue-500 overflow-hidden text-gray-900 font-sans">
      {/* Salle du Temps background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-70"
  
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/60" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        {!started ? (
          <div className="flex flex-col md:flex-row items-center gap-10 bg-white/40 backdrop-blur-md border border-cyan-300 rounded-xl p-8 w-full max-w-4xl shadow-lg">
            <img
              src="/ippo.svg"
              alt="Ippo"
              className="w-48 h-auto object-contain"
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (totalDuration > 0 && totalRounds > 0) startEMOM();
                else alert("Les valeurs doivent être correctes !");
              }}
              className="w-full md:w-2/3 space-y-6"
            >
              <h1 className="text-3xl font-bold mb-4 text-cyan-800">
                ⏱️ EMOM - Crée ton entraînement
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">Minutes</label>
                  <input
                    type="number"
                    min={0}
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Minutes"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">Secondes</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Secondes"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">
                  Nombre de rounds
                </label>
                <input
                  type="number"
                  min={1}
                  value={rounds}
                  onChange={(e) => setRounds(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-700 text-white py-3 rounded-md font-semibold hover:bg-cyan-600 transition"
              >
                Démarrer l'EMOM
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <EMOM
              roundDuration={totalDuration}
              rounds={totalRounds}
              onComplete={handleComplete}
            />
            <button
              onClick={resetEMOM}
              className="bg-red-600 mt-4 hover:bg-red-700 px-4 py-2 rounded text-white font-bold"
            >
              Terminer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
