import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import MyClaims from "../pages/claims/MyClaims";
import Notifications from "../pages/notifications/Notifications";
import ProtectedRoute from "./ProtectedRoute";
import LostItems from "../pages/lost/LostItems";
import FoundItems from "../pages/found/FoundItems";
import ItemDetail from "../pages/items/ItemDetail";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLostItems from "../pages/admin/AdminLostItems";
import AdminFoundItems from "../pages/admin/AdminFoundItems";



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

      <Route
  path="/lost-items"
  element={
    <ProtectedRoute>
      <LostItems />
    </ProtectedRoute>
  }
/>

<Route
  path="/found-items"
  element={
    <ProtectedRoute>
      <FoundItems />
    </ProtectedRoute>
  }
/>

<Route
  path="/item/:type/:id"
  element={
    <ProtectedRoute>
      <ItemDetail />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/lost-items"
  element={
    <AdminProtectedRoute>
      <AdminLostItems />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/found-items"
  element={
    <AdminProtectedRoute>
      <AdminFoundItems />
    </AdminProtectedRoute>
  }
/>




    </Routes>
  );
}
