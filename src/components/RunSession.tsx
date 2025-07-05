import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import { db } from "../firebase/config";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris

export default function RunSession() {
  const { user } = useAuth();

  const [positions, setPositions] = useState<[number, number][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((t) => t + 1);
      }, 1000);

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            // ✅ Toujours version fonctionnelle
            setPositions((prev) => [...prev, [latitude, longitude]]);
          },
          (err) => console.error("Erreur getCurrentPosition:", err),
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        );

        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            // ✅ Toujours version fonctionnelle
            setPositions((prev) => [...prev, [latitude, longitude]]);
          },
          (err) => console.error("Erreur watchPosition:", err),
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        );
      } else {
        alert("La géolocalisation n'est pas disponible dans ce navigateur.");
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isRunning]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const calcHaversine = (
    [lat1, lon1]: [number, number],
    [lat2, lon2]: [number, number]
  ) => {
    const R = 6371e3;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const totalDistance = positions.reduce((acc, cur, idx, arr) => {
    if (idx === 0) return 0;
    return acc + calcHaversine(arr[idx - 1], cur);
  }, 0);

  // 👣 Steps
  const stepLengthMeters = 0.75;
  const steps = Math.floor(totalDistance / stepLengthMeters);

  // 🔥 Calories
  const userWeightKg = 70;
  const met = 8;
  const hours = elapsedTime / 3600;
  const calories = Math.round(met * userWeightKg * hours);

  // 🚀 Vitesse moyenne
  const avgSpeedKmh =
    elapsedTime > 0 ? totalDistance / 1000 / (elapsedTime / 3600) : 0;

  const handleSave = async () => {
    if (!user) {
      alert("Tu dois être connecté pour sauvegarder.");
      return;
    }
    if (positions.length < 2) {
      alert("Tu dois avoir au moins 2 positions enregistrées.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const xpGained = Math.round(totalDistance / 100);

    try {
      await updateDoc(userRef, {
        runs: arrayUnion({
          date: Date.now(),
          duration: elapsedTime,
          distance: totalDistance,
          steps,
          calories,
          avgSpeedKmh,
        }),
        xpTotal: xpGained,
      });

      alert(`Session sauvegardée ! Tu as gagné ${xpGained} XP !`);
      setPositions([]);
      setElapsedTime(0);
      setIsRunning(false);
    } catch (error) {
      alert("Erreur lors de la sauvegarde : " + error);
      console.error(error);
    }
  };

  const center =
    positions.length > 0 ? positions[positions.length - 1] : defaultPosition;

  const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  useEffect(() => {
    if (mapRef.current && positions.length > 0) {
      const lastPos = positions[positions.length - 1];
      mapRef.current.flyTo(lastPos, 16);
    }
  }, [positions]);

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white font-sans overflow-x-scroll">
      <div className="absolute top-4 w-full text-center text-3xl font-bold tracking-wide text-white drop-shadow-md">
        🏃‍♂️ Session de Course
      </div>
  
      <div className="flex flex-col items-center justify-center h-full gap-6 p-4">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
          <MapContainer
            center={center}
            zoom={17}
            style={{ height: "400px", width: "350px" }}
            ref={mapRef as any}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positions.length > 0 && (
              <>
                <Polyline positions={positions} color="cyan" weight={5} />
                <Marker position={center} icon={icon}>
                  <Popup>Tu es ici</Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>
  
        <div className="w-[350px] bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-3 shadow-lg">
          <p className="text-lg font-semibold">⏱️ Temps : {formatTime(elapsedTime)}</p>
          <p className="text-lg font-semibold">
            📏 Distance : {(totalDistance / 1000).toFixed(2)} km
          </p>
          <p className="text-lg font-semibold">👣 Pas : {steps}</p>
          <p className="text-lg font-semibold">🔥 Calories : {calories} kcal</p>
          <p className="text-lg font-semibold">
            🚀 Vitesse : {avgSpeedKmh.toFixed(1)} km/h
          </p>
        </div>
  
        <div className="flex gap-4">
          <button
            onClick={() => setIsRunning((r) => !r)}
            className={`px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-300 ${
              isRunning
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isRunning ? "Stop" : "Démarrer"}
          </button>
  
          <button
            onClick={handleSave}
            disabled={isRunning || positions.length < 2}
            className={`px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-300 ${
              isRunning || positions.length < 2
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );  
}
