import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
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
            console.log("Position initiale:", latitude, longitude);
            setPositions((old) => [...old, [latitude, longitude]]);
          },
          (err) => console.error("Erreur getCurrentPosition:", err),
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        );

        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            console.log("Nouvelle position:", latitude, longitude);
            setPositions((old) => [...old, [latitude, longitude]]);
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

  // ⏱️ Chrono format
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  // 📏 Distance Haversine
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

  // 👉 Auto center à chaque nouvelle position
  useEffect(() => {
    if (mapRef.current && positions.length > 0) {
      const lastPos = positions[positions.length - 1];
      mapRef.current.flyTo(lastPos, 16);
    }
  }, [positions]);

  return (
    <div className="relative max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Course</h2>
      

      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "300px", width: "100%" }}
        ref={mapRef as any} // TypeScript : forcer ref
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {positions.length > 0 && (
          <>
            <Polyline positions={positions} color="blue" />
            <Marker position={center} icon={icon}>
              <Popup>Tu es ici</Popup>
            </Marker>
          </>
        )}
      </MapContainer>

     

      <div className="mt-4 text-center">
        <p className="text-xl mb-2">Temps : {formatTime(elapsedTime)}</p>
        <p className="text-xl mb-2">
          Distance : {(totalDistance / 1000).toFixed(2)} km
        </p>

        <button
          onClick={() => setIsRunning((r) => !r)}
          className={`px-6 py-2 rounded ${
            isRunning ? "bg-red-500" : "bg-green-500"
          } text-white font-bold mr-2`}
        >
          {isRunning ? "Stop" : "Démarrer"}
        </button>

        <button
          onClick={handleSave}
          disabled={isRunning || positions.length < 2}
          className="px-6 py-2 rounded bg-blue-600 text-white font-bold"
        >
          Sauvegarder
        </button>
        <button
        onClick={() => {
          if (mapRef.current && positions.length > 0) {
            const lastPos = positions[positions.length - 1];
            mapRef.current.flyTo(lastPos, 16);
          }
        }}
        className="mt-2  px-4 py-2 rounded bg-yellow-500 text-white font-bold shadow z-[1000]"
      >
        📍 Centrer
      </button>
      </div>
    </div>
  );
}
