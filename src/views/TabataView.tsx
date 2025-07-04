import React, { useState } from "react";
import Tabata from "../components/Tabata";

export default function TabataView() {
  const [workMinutes, setWorkMinutes] = useState("0");
  const [workSeconds, setWorkSeconds] = useState("20");
  const [restMinutes, setRestMinutes] = useState("0");
  const [restSeconds, setRestSeconds] = useState("10");
  const [rounds, setRounds] = useState("8");
  const [started, setStarted] = useState(false);

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRounds(e.target.value);
  };

  const totalWorkTime =
    Number(workMinutes || "0") * 60 + Number(workSeconds || "0");
  const totalRestTime =
    Number(restMinutes || "0") * 60 + Number(restSeconds || "0");
  const totalRounds = Number(rounds || "0");

  const startTabata = () => {
    setStarted(true);
  };

  const resetTabata = () => {
    setStarted(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-blue-300 via-black-200 to-blue-500 overflow-hidden text-gray-900 font-sans p-6">
      {!started ? (
        <div className="flex flex-col md:flex-row items-center rounded shadow-2xl p-8 w-full bg-white/40 backdrop-blur-md border border-cyan-300 max-w-4xl">
          <img
            src="/rock lee.svg"
            alt="Rock lee"
            className="w-64 h-auto object-contain mb-8 md:mb-0"
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (totalWorkTime > 0 && totalRounds > 0) {
                startTabata();
              } else {
                alert("Les valeurs doivent être correctes !");
              }
            }}
            className="w-full md:w-2/3 space-y-6"
          >
            <h1 className="text-3xl font-bold mb-4">
              🔥 Tabata - Crée ton entraînement
            </h1>

            {/* Temps de travail */}
            <div>
              <label className="block mb-1 font-semibold">
                Temps de travail
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={workMinutes}
                  onChange={(e) => setWorkMinutes(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded px-3 py-2"
                  placeholder="Minutes"
                />
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={workSeconds}
                  onChange={(e) => setWorkSeconds(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded px-3 py-2"
                  placeholder="Secondes"
                />
              </div>
            </div>

            {/* Temps de repos */}
            <div>
              <label className="block mb-1 font-semibold">Temps de repos</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={restMinutes}
                  onChange={(e) => setRestMinutes(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded px-3 py-2"
                  placeholder="Minutes"
                />
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={restSeconds}
                  onChange={(e) => setRestSeconds(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded px-3 py-2"
                  placeholder="Secondes"
                />
              </div>
            </div>

            {/* Rounds */}
            <div>
              <label className="block mb-1 font-semibold">
                Nombre de rounds
              </label>
              <input
                type="number"
                min={1}
                value={rounds}
                onChange={handleRoundsChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-700 text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
            >
              Démarrer le Tabata
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Tabata
            workTime={totalWorkTime}
            restTime={totalRestTime}
            rounds={totalRounds}
            onComplete={() => {
              alert("Tabata terminé, bravo !");
              resetTabata();
            }}
          />
          <button
            onClick={resetTabata}
            className="bg-red-600 mt-2 hover:bg-red-700 px-3 py-2 rounded text-white font-bold"
          >
            Terminer
          </button>
        </div>
      )}
    </div>
  );
}
