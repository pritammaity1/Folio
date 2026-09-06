import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div
          className={[
            "flex items-center gap-3",
            "font-body text-[14px]",
            "text-[var(--color-on-surface-varient)]",
          ].join(" ")}
        >
          <span
            className={[
              "h-4 w-4 animate-spin rounded-full",
              "border-2 border-[var(--color-outline-varient)]",
              "border-t-[var(--color-primary)]",
            ].join(" ")}
            aria-hidden="true"
          />
          <span>Loading your work space...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
