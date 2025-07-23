import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export default function CreateSession() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user || user.role !== "Maitre") {
    return <p className="text-center mt-10">Accès refusé</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "sessions"), {
        coachId: user.uid,
        coachName: user.displayName,
        title,
        description,
        maxParticipants,
        dateTime: Timestamp.fromDate(new Date(dateTime)),
        createdAt: Timestamp.now(),
        participants: [],
      });

      setMessage("Session créée avec succès !");
      setTitle("");
      setDescription("");
      setDateTime("");
      setMaxParticipants(10);

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Erreur création session :", error);
      setMessage("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-b from-indigo-300 to-indigo-600 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-indigo-800 text-center">
          Créer une session live
        </h2>

        {message && (
          <p className="text-center text-sm font-medium text-green-600">{message}</p>
        )}

        <input
          type="text"
          placeholder="Titre de la session"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          placeholder="Description de la session"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
         <label> Date et heure </label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label> Nombre de participants </label>

        <input
          type="number"
          min={1}
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 rounded-lg transition"
        >
          {loading ? "Création..." : "Créer la session"}
        </button>
      </form>
    </div>
  );
}
