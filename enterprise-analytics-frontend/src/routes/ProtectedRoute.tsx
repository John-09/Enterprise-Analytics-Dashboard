import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const token = useSelector((s: RootState) => s.auth.token);
  if (!token) return <Navigate to="/login" />;
  return children;
}
