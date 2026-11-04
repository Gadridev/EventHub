import { Button } from "../../components/ui/Button";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "./hooks/useAuth";

export function SessionLoading() {
  return (
    <p role="status" className="p-8 text-muted">
      Verifying your session…
    </p>
  );
}

export function SessionVerificationError() {
  const { retryVerification } = useAuth();
  return (
    <div className="flex flex-col items-start gap-4 p-8">
      <p role="alert" className="text-danger">
        Unable to verify your session. Please check your connection and try
        again.
      </p>
      <Button onClick={() => void retryVerification()}>Retry</Button>
    </div>
  );
}

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, verificationError } = useAuth();

  if (isLoading) {
    return <SessionLoading />;
  }
  if (!isAuthenticated && verificationError) {
    return <SessionVerificationError />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
