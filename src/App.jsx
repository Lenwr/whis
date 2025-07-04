import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthView from "./views/AuthView";
import Dashboard from "./views/Dashboard";
import EmomView from "./views/EmomView";
import TabataView from "./views/TabataView";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute, PublicRoute } from "./Guards/RouteGuards";
import Layout from "./layout/DashbordLayout"; // <= Ton Layout avec Header/Footer/Outlet
import LeaderboardView from "./views/LeaderBoardView";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<AuthView />} />
          </Route>

          {/* Routes privées avec Layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}> {/* Layout pour routes privées */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/emom" element={<EmomView />} />
              <Route path="/tabata" element={<TabataView />} />
              <Route path="/leaderboard" element={<LeaderboardView />} />
            </Route>
          </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

