import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MangaBackground from "../components/MangaBackground";
import { useAuth } from "../context/AuthContext";

export default function AuthView() {
  const { user, loading, error, signUp, signIn, clearError } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [anime, setAnime] = useState("");
  const [classe, setClasse] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const animeClasses: Record<string, string[]> = {
    Naruto: ["Ninja de Konoha", "Ninja de Suna", "Ninja de Kiri"],
    Bleach: ["Shinigami", "Quincy", "Arrancar"],
    DragonBall: ["Saiyan", "Terrien", "Namek"],
  };

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleAuth = async () => {
    setLocalError("");
    clearError();
    try {
      if (isSignUp) {
        if (!anime) {
          setLocalError("Choisissez d'abord un anime !");
          return;
        }
        if (!classe) {
          setLocalError("Choisissez une classe !");
          return;
        }
        await signUp(email, password, displayName, anime, classe);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setLocalError("Erreur lors de l'authentification");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-300 p-4 to-white">
      <MangaBackground />

      <img
        src="/whis.svg"
        alt="Whis Sensei"
        className="absolute top-10 right-10 w-[50%] opacity-70 drop-shadow-xl
                   sm:top-6 sm:right-6 sm:w-[20%] sm:opacity-50"
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-800/50 to-black"></div>

      <motion.div
        className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 w-full max-w-md shadow-2xl mt-30 sm:mt-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          {isSignUp ? "Rejoins le Dojo" : "Connexion au Dojo"}
        </h1>

        <p className="text-white/70 mb-6 text-center italic">
          {isSignUp
            ? "« Lève-toi, jeune héros. »"
            : "« Entre et poursuis ton entraînement. »"}
        </p>

        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Nom du guerrier"
              className="w-full mb-4 p-3 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                clearError();
                setLocalError("");
              }}
            />

            <select
              className="w-full mb-4 p-3 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
              value={anime}
              onChange={(e) => {
                setAnime(e.target.value);
                setClasse("");
                clearError();
                setLocalError("");
              }}
            >
              <option value="">Choisis ton anime</option>
              {Object.keys(animeClasses).map((animeName) => (
                <option key={animeName} value={animeName}>
                  {animeName}
                </option>
              ))}
            </select>

            {anime && (
              <select
                className="w-full mb-4 p-3 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
                value={classe}
                onChange={(e) => {
                  setClasse(e.target.value);
                  clearError();
                  setLocalError("");
                }}
              >
                <option value="">Choisis ta classe</option>
                {animeClasses[anime].map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            )}
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
            setLocalError("");
          }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-6 p-3 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError();
            setLocalError("");
          }}
        />

        {(error || localError) && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {error || localError}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAuth}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-semibold mb-4 transition"
        >
          {isSignUp ? "Créer mon compte" : "Se connecter"}
        </motion.button>

        <p
          onClick={() => {
            setIsSignUp(!isSignUp);
            clearError();
            setLocalError("");
          }}
          className="text-center text-sm text-white/70 cursor-pointer hover:underline"
        >
          {isSignUp
            ? "Déjà inscrit ? Connecte-toi"
            : "Pas encore de compte ? Inscris-toi"}
        </p>
      </motion.div>
    </div>
  );
}
