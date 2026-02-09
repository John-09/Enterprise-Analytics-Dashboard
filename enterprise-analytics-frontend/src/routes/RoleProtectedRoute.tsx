import { Navigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import type { JSX } from "react";

export default function RoleProtectedRoute({
  allowed,
  children,
}: {
  allowed: string[];
  children: JSX.Element;
}) {
  const role = useRole();
  console.log(role,'dhagjhddasjdhajshg');
  
  if (!allowed.includes(role)) {
    return <Navigate to="/access-denied" replace />;
  }
  return children;
}
