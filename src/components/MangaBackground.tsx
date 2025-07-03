import React from "react";
import { motion } from "framer-motion";

function Cloud({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 39"
      fill="white"
      style={{ ...style, filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))" }}
      animate={{ x: ["-120%", "120%"] }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute"
    >
      <ellipse cx="20" cy="20" rx="20" ry="15" />
      <ellipse cx="40" cy="15" rx="20" ry="15" />
    </motion.svg>
  );
}

function Particle({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.div
      className="rounded-full bg-white/70"
      style={{
        width: 4,
        height: 4,
        position: "absolute",
        ...style,
        filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))",
      }}
      animate={{
        opacity: [0.3, 1, 0.3],
        y: [0, -6, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        repeatType: "mirror",
        delay: Math.random() * 5,
      }}
    />
  );
}

export default function MangaBackground() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black overflow-hidden">
      {/* Nuages animés */}
      <Cloud style={{ top: "15%", left: "-120%", width: 220, opacity: 0.4 }} />
      <Cloud style={{ top: "35%", left: "-200%", width: 280, opacity: 0.3 }} />
      <Cloud style={{ top: "60%", left: "-160%", width: 250, opacity: 0.35 }} />

      {/* Particules lumineuses */}
      {[...Array(15)].map((_, i) => (
        <Particle
          key={i}
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}
    </div>
  );
}
