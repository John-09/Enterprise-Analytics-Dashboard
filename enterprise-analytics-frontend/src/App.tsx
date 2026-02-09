import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Customers from "./pages/Customers";
import AccessDenied from "./pages/AccessDenied";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import AppLayout from "./layout/AppLayout";
import Orders from "./pages/Orders";
import ChangePassword from "./pages/ChangePassword";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Access Denied */}
      <Route
        path="/access-denied"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AccessDenied />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected App */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowed={["admin", "manager"]}>
              <AppLayout>
                <Orders />
              </AppLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Manager/Admin only */}
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowed={["admin", "manager"]}>
              <AppLayout>
                <Customers />
              </AppLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Admin-only */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowed={["admin"]}>
              <AppLayout>
                <Users />
              </AppLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
