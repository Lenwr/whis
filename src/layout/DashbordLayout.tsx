import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[url('/back3.jpg')] bg-cover bg-center">
      {/* HEADER */}
      <div className="navbar bg-cyan-700 shadow-sm">
        <div className="flex-1">
          <Link to="/dashboard" className="btn btn-ghost text-xl">
            WHIS
          </Link>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Avatar"
                  src="https://i.pinimg.com/736x/5b/a7/f5/5ba7f5b07990c334f6144b0ca58c011f.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-cyan-700 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <button
                  onClick={() => navigate("/leaderboard")}
                  className="w-full text-left"
                >
                  Voir le Classement
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="w-full text-left">
                  Quitter la Salle
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        <Outlet /> {/* Ici ton contenu change selon la route */}
      </main>

      {/* FOOTER */}
      <footer className="footer text-center sm:footer-horizontal bg-cyan-700 text-neutral-content items-center p-4">
    
          <p>Copyright © {new Date().getFullYear()} - Tous droits réservés A.S.A </p>
    
      </footer>
    </div>
  );
}
