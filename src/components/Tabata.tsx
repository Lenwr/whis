import React, { useEffect, useRef, useState } from "react";

interface TabataProps {
  workTime: number;
  restTime: number;
  rounds: number;
  onComplete?: () => void;
}

export default function Tabata({
  workTime,
  restTime,
  rounds,
  onComplete,
}: TabataProps) {
  const [secondsLeft, setSecondsLeft] = useState(workTime);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalCycle = isWorking ? workTime : restTime;
  const percent = ((totalCycle - secondsLeft) / totalCycle) * 100;

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
      if (isWorking) {
        if (restTime > 0) {
          setIsWorking(false);
          setSecondsLeft(restTime);
        } else {
          nextRound();
        }
      } else {
        nextRound();
      }
    }
  }, [secondsLeft, isWorking]);

  const nextRound = () => {
    if (currentRound >= rounds) {
      finish();
    } else {
      setCurrentRound((r) => r + 1);
      setIsWorking(true);
      setSecondsLeft(workTime);
    }
  };

  const finish = () => {
    setIsRunning(false);
    setIsComplete(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (onComplete) onComplete?.();
  };

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (secondsLeft <= 0) {
        setSecondsLeft(workTime);
        setCurrentRound(1);
        setIsComplete(false);
        setIsWorking(true);
      }
    }
  };

  const pause = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const reset = () => {
    setIsRunning(false);
    setIsComplete(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(workTime);
    setCurrentRound(1);
    setIsWorking(true);
  };

  return (
    <div className="flex flex-col p-4 items-center bg-black/40 backdrop-blur-md rounded-xl w-full max-w-3xl shadow-lg border border-cyan-300 justify-center relative">
      {!isComplete ? (
        <>
          <div className="text-3xl font-extrabold mb-4">
            {isWorking ? "Travail 💪" : "Repos 🧘"}
          </div>

          <div className="relative w-80 h-80 mb-2">
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
                stroke={isWorking ? "#34d399" : "#60a5fa"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={
                  2 * Math.PI * 120 - (percent / 100) * 2 * Math.PI * 120
                }
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

          <div className="text-[2em] font-mono text-black">
            {Math.floor(secondsLeft / 60)
              .toString()
              .padStart(2, "0")}
            :{(secondsLeft % 60).toString().padStart(2, "0")}
          </div>

          <div className="mt-2 text-black">
            Round {currentRound} / {rounds}
          </div>

          <button
            onClick={reset}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réinitialiser
          </button>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div className="text-2xl text-green-700 font-extrabold">
            🎉 Tabata Terminé !
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
