import React, { useEffect, useRef, useState } from "react";

interface EMOMProps {
  roundDuration?: number;
  rounds?: number;
  onComplete?: (xp: number) => void; // <- reçoit XP
}

export default function EMOM({
  roundDuration = 60,
  rounds = 10,
  onComplete,
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

        // Calcul XP = 1 XP par minute totale
        const xp = Math.floor(totalDuration / 60);
        if (onComplete) onComplete(xp);
      } else {
        setCurrentRound((r) => r + 1);
        setSecondsLeft(roundDuration);
      }
    }
  }, [secondsLeft, isRunning, currentRound, rounds, roundDuration, totalDuration, onComplete]);

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

  const percentPerRound = ((roundDuration - secondsLeft) / roundDuration) * 100;

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
    <div className="flex flex-col items-center px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl w-full max-w-3xl shadow-lg border border-cyan-300 relative">
      {!isComplete && (
        <>
          <div className="relative w-80 h-80 mb-2 px-4 ">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="120"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
                strokeDasharray="5 15"
              />
              <circle
                cx="50%"
                cy="50%"
                r="120"
                fill="none"
                stroke="#4ade80"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={754}
                strokeDashoffset={754 - (percentPerRound / 100) * 754}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <button
              onClick={isRunning ? pause : start}
              className="absolute inset-0 flex items-center justify-center"
            >
              {isRunning ? (
                <svg
                  className="w-20 h-20 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="5" width="4" height="14"></rect>
                  <rect x="14" y="5" width="4" height="14"></rect>
                </svg>
              ) : (
                <svg
                  className="w-20 h-20 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              )}
            </button>
          </div>

          <div className="flex flex-col items-center justify-center ">
            <div className="text-[2em] font-mono text-black">
              {Math.floor(secondsLeft / 60)
                .toString()
                .padStart(2, "0")}
              :{(secondsLeft % 60).toString().padStart(2, "0")}
            </div>

            <div className="text-xl font-bold my-2 text-green-500">
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

            <div className="mt-4">
              <img src={scouterGif} alt="Scouter" className="w-full h-auto" />
            </div>

            <div className="mt-4 text-black">
              Round {currentRound} / {rounds}
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={reset}
                className=" mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </>
      )}

      {isComplete && (
        <div className="flex flex-col justify-center items-center">
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
