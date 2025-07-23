import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthView from "./views/AuthView";
import Dashboard from "./views/Dashboard";
import EmomView from "./views/EmomView";
import TabataView from "./views/TabataView";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute, PublicRoute } from "./Guards/RouteGuards";
import Layout from "./layout/DashbordLayout";
import LeaderboardView from "./views/LeaderBoardView";
import RunSession from "./components/RunSession";
import Profile from "./views/Profile";
import CoachsList from "./views/CoachList";
import CreateSession from "./components/CreateSession";
import DashboardCoach from "./views/DashboardCoach";
import AvailableSessions from "./components/AvailableSessions";

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
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/emom" element={<EmomView />} />
              <Route path="/tabata" element={<TabataView />} />
              <Route path="/leaderboard" element={<LeaderboardView />} />
              <Route path="/run" element={<RunSession />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/coachs" element={<CoachsList />} />
              <Route path="/create-session" element={<CreateSession />} />
              <Route path="/dashboard-coach" element={<DashboardCoach />} />
              <Route path="/available-sessions" element={<AvailableSessions />} />
            </Route>
          </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
