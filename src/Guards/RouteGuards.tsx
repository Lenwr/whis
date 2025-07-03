import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  // Si déjà connecté, redirige vers dashboard
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
