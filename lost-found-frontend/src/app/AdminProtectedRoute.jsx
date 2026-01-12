import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { user, role } = useContext(AuthContext);

  // not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // logged in but NOT admin
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ admin
  return children;
}
