import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Jab auth state load ho rahi ho
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // Agar user login nahi hai
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Agar login hai
  return children;
}
