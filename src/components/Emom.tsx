import React, { useEffect, useRef, useState } from "react";

interface EMOMProps {
  roundDuration?: number;
  rounds?: number;
  onComplete?: () => void;
}

export default function EMOM({
  roundDuration = 60,
  rounds = 10,
}: EMOMProps) {
  const [secondsLeft, setSecondsLeft] = useState(roundDuration);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = roundDuration * rounds;

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft <= 0) {
      if (currentRound >= rounds) {
        setIsRunning(false);
        setIsComplete(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCurrentRound((r) => r + 1);
        setSecondsLeft(roundDuration);
      }
    }
  }, [secondsLeft, isRunning, currentRound, rounds, roundDuration]);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (secondsLeft <= 0) {
        setSecondsLeft(roundDuration);
        setCurrentRound(1);
        setIsComplete(false);
      }
    }
  };

  const pause = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setIsComplete(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(roundDuration);
    setCurrentRound(1);
  };

  const timeElapsed =
    (currentRound - 1) * roundDuration + (roundDuration - secondsLeft);
  const powerLevel = Math.min(
    9000,
    Math.round((timeElapsed / totalDuration) * 9000)
  );
  const percent = Math.min(100, (powerLevel / 9000) * 100);

  // GIF dynamique pendant l'effort
  let scouterGif = "";
  if (!isComplete) {
    if (powerLevel > 8000) {
      scouterGif = "/scouter3.gif";
    } else if (powerLevel > 7000) {
      scouterGif = "/scouter2.gif";
    } else {
      scouterGif = "/scouter1.gif";
    }
  }

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded shadow relative">
      {!isComplete && (
        <>
          {/* Timer */}
          <div className="text-5xl font-mono mb-2 text-black">
            {Math.floor(secondsLeft / 60).toString().padStart(2, "0")}:
            {(secondsLeft % 60).toString().padStart(2, "0")}
          </div>

          {/* Scouter - Puissance */}
          <div className="text-xl font-bold mb-2 text-green-700">
            Puissance : {powerLevel}
          </div>
          <div className="w-full max-w-md h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          {powerLevel >= 9000 && (
            <div className="mt-2 text-red-600 font-extrabold text-2xl animate-pulse">
              IT'S OVER 9000 !!!
            </div>
          )}

          {/* GIF pendant l'effort */}
          <div className="mt-4">
            <img src={scouterGif} alt="Scouter" className="w-48 h-auto" />
          </div>

          <div className="mt-4 text-black">
            Round {currentRound} / {rounds}
          </div>

          <div className="flex space-x-4 mt-4">
            {!isRunning ? (
              <button
                onClick={start}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Démarrer
              </button>
            ) : (
              <button
                onClick={pause}
                className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
              >
                Pause
              </button>
            )}
            <button
              onClick={reset}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réinitialiser
            </button>
          </div>
        </>
      )}

      {/* Écran final */}
      {isComplete && (
        <div className="flex flex-col items-center">
          <img
            src="/scouter3.gif"
            alt="Scouter Final"
            className="w-64 h-auto animate-bounce"
          />
          <div className="mt-4 text-2xl text-green-700 font-extrabold">
            Mission accomplie !
          </div>
          <button
            onClick={reset}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}
