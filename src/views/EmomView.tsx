import React, { useState } from "react";
import EMOM from "../components/Emom";

export default function EmomView() {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [rounds, setRounds] = useState(10);
  const [started, setStarted] = useState(false);

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) setMinutes(value);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0 && value < 60) setSeconds(value);
  };

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > 0) setRounds(value);
  };

  const startEMOM = () => {
    setStarted(true);
  };

  const resetEMOM = () => {
    setStarted(false);
  };

  const totalDuration = minutes * 60 + seconds;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 p-6">
      {!started ? (
        <div className="flex flex-col md:flex-row items-center gap-10 bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl">
          {/* Ippo image */}
          <img
            src="/ippo.svg"
            alt="Ippo"
            className="w-48 h-auto object-contain"
          />

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (totalDuration > 0) startEMOM();
              else alert("La durée doit être supérieure à zéro !");
            }}
            className="w-full md:w-2/3 space-y-6"
          >
            <h1 className="text-3xl font-bold mb-4">⏱️ EMOM - Crée ton entraînement</h1>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Minutes</label>
                <input
                  type="number"
                  min={0}
                  value={minutes}
                  onChange={handleMinutesChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex-1">
                <label className="block mb-1 font-semibold">Secondes</label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={handleSecondsChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Nombre de rounds</label>
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
              className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
            >
              Démarrer l'EMOM
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <EMOM
            roundDuration={totalDuration}
            rounds={rounds}
            onComplete={() => {
              alert("EMOM terminé, bravo !");
              resetEMOM();
            }}
          />
          <button
            onClick={resetEMOM}
            className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-white font-bold"
          >
            Arrêter
          </button>
        </div>
      )}
    </div>
  );
}
