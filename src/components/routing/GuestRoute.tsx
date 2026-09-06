import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div
          className={[
            "flex items-center gap-3",
            "font-body text-[14px]",
            "text-[var(--color-outline-varient)]",
            "border-t-[var(--color-on-surface-varient)]",
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
          <span>Checking your account...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
