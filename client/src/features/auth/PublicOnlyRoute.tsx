import { Navigate, Outlet } from "react-router";
import { useAuth } from "./hooks/useAuth";
import { SessionLoading, SessionVerificationError } from "./ProtectedRoute";

export function PublicOnlyRoute() {
  const { isLoading, isAuthenticated, verificationError } = useAuth();

  if (isLoading) {
    return <SessionLoading />;
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (verificationError) {
    return <SessionVerificationError />;
  }
  return <Outlet />;
}
