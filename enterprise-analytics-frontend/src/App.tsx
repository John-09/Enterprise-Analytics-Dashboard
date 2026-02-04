import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import AppLayout from "./layout/AppLayout";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

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
