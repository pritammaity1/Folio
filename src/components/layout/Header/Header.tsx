import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";

interface HeaderProps {
  title?: string;
}

interface RouteTitle {
  pattern: RegExp;
  title: string;
}

const routeTitles: RouteTitle[] = [
  {
    pattern: /^\/dashboard$/,
    title: "Dashboard",
  },
  {
    pattern: /^\/posts$/,
    title: "Posts",
  },
  {
    pattern: /^\/posts\/new$/,
    title: "New Post",
  },
  {
    pattern: /^\/posts\/[^/]+\/edit$/,
    title: "Edit Post",
  },
  {
    pattern: /^\/posts\/[^/]+$/,
    title: "Post",
  },
  {
    pattern: /^\/media$/,
    title: "Media",
  },

  {
    pattern: /^\/analytics$/,
    title: "Analytics",
  },
  {
    pattern: /^\/users$/,
    title: "Users",
  },
  {
    pattern: /^\/settings$/,
    title: "Settings",
  },
  {
    pattern: /^\/settings\/profile$/,
    title: "Profile Settings",
  },
  {
    pattern: /^\/settings\/security$/,
    title: "Security",
  },
  {
    pattern: /^\/settings\/notifications$/,
    title: "Notifications",
  },
  {
    pattern: /^\/settings\/appearance$/,
    title: "Appearance",
  },
  {
    pattern: /^\/settings\/roles$/,
    title: "Roles & Permissions",
  },
  {
    pattern: /^\/profile$/,
    title: "Profile",
  },
];

function getRouteTitle(pathname: string) {
  const matchedRoute = routeTitles.find((route) =>
    route.pattern.test(pathname),
  );

  return matchedRoute?.title ?? "Folio";
}

function getUserInitial(displayName?: string | null, email?: string | null) {
  const source = displayName?.trim() || email?.trim() || "Editor";

  return source.charAt(0).toUpperCase();
}

export function Header({ title }: HeaderProps) {
  const location = useLocation();
  const { user } = useAuth();

  const pageTitle = useMemo(() => {
    return title?.trim() || getRouteTitle(location.pathname);
  }, [location.pathname, title]);

  const userInitial = getUserInitial(user?.displayName, user?.email);

  const userName =
    user?.displayName?.trim() || user?.email?.split("@")[0] || "Editor";

  return (
    <header
      className={[
        "sticky top-0 z-[var(--z-header)]",
        "flex h-[var(--header-height)] shrink-0 items-center",
        "border-b border-[var(--color-outline-variant)]",
        "bg-[var(--color-background)]",
      ].join(" ")}
    >
      <div className="flex h-full min-w-0 flex-1 items-center justify-between px-4 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center">
          <h1
            className={[
              "truncate",
              "font-body text-[16px] font-semibold",
              "tracking-[-0.01em]",
              "text-[var(--color-on-surface)]",
            ].join(" ")}
          >
            {pageTitle}
          </h1>
        </div>

        <div className="ml-4 flex shrink-0 items-center">
          <button
            type="button"
            aria-label={`Open ${userName} account menu`}
            title={userName}
            className={[
              "group flex h-10 w-10 items-center justify-center",
              "rounded-full",
              "!bg-[var(--color-primary)]",
              "font-body text-[13px] font-bold",
              "!text-[var(--color-on-primary)]",
              "shadow-[var(--shadow-sm)]",
              "transition-[background-color,box-shadow,transform]",
              "duration-[var(--motion-fast)]",
              "ease-[var(--ease-standard)]",
              "hover:!bg-[var(--color-primary-container)]",
              "hover:shadow-[var(--shadow-md)]",
              "active:translate-y-px",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--color-primary)]",
              "focus-visible:outline-offset-2",
            ].join(" ")}
          >
            <span aria-hidden="true">{userInitial}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
