import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { Icon } from "../../ui/Icon/Icon";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { auth } from "../../../services/firebase/auth";

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
    pattern: /^\/blog$/,
    title: "Blog",
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
  const navigate = useNavigate();
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const pageTitle = useMemo(() => {
    return title?.trim() || getRouteTitle(location.pathname);
  }, [location.pathname, title]);

  const userInitial = getUserInitial(user?.displayName, user?.email);

  const userName =
    user?.displayName?.trim() || user?.email?.split("@")[0] || "Editor";

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to sign out.", error);
      setLoggingOut(false);
    }
  }

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

        <div ref={menuRef} className="relative ml-4 shrink-0">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={`Open ${userName} account menu`}
            title={userName}
            onClick={() => setMenuOpen((current) => !current)}
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

          {menuOpen && (
            <div
              role="menu"
              aria-label="Account menu"
              className={[
                "absolute right-0 top-[calc(100%+10px)]",
                "w-[190px] overflow-hidden",
                "rounded-[8px]",
                "border border-[var(--color-outline-variant)]",
                "bg-[var(--color-surface)]",
                "p-1.5",
                "shadow-[var(--shadow-lg)]",
                "origin-top-right",
                "animate-[fadeIn_140ms_ease-out]",
              ].join(" ")}
            >
              <div className="px-3 py-2.5">
                <p className="truncate font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                  {userName}
                </p>

                {user?.email && (
                  <p className="mt-0.5 truncate font-body text-[10px] text-[var(--color-on-surface-variant)]">
                    {user.email}
                  </p>
                )}
              </div>

              <div className="my-1 h-px bg-[var(--color-outline-variant)]" />

              <button
                type="button"
                role="menuitem"
                disabled={loggingOut}
                onClick={() => {
                  void handleLogout();
                }}
                className={[
                  "flex w-full items-center gap-2.5",
                  "rounded-[6px]",
                  "px-3 py-2.5",
                  "font-body text-[12px] font-medium",
                  "text-[var(--color-on-surface)]",
                  "transition-[background-color,color]",
                  "duration-[var(--motion-fast)]",
                  "hover:bg-[var(--color-surface-container-low)]",
                  "hover:text-[var(--color-primary)]",
                  "disabled:pointer-events-none disabled:opacity-50",
                ].join(" ")}
              >
                <Icon name="logout" size={15} strokeWidth={1.9} />

                <span>{loggingOut ? "Signing out..." : "Log out"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
