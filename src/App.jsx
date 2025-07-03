import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthView from "./views/AuthView";
import Dashboard from "./views/Dashboard";
import EmomView from "./views/EmomView";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute, PublicRoute } from "./Guards/RouteGuards";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<AuthView />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<PrivateRoute />}>
          <Route path="/emom" element={<EmomView />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
