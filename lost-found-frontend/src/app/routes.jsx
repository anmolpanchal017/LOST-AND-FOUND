import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import MyClaims from "../pages/claims/MyClaims";
import Notifications from "../pages/notifications/Notifications";
import ProtectedRoute from "./ProtectedRoute";

export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-claims"
        element={
          <ProtectedRoute>
            <MyClaims />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
