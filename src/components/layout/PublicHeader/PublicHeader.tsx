import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { Icon } from "../../ui/Icon/Icon";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Blog", path: "/blog" },

  { label: "About", path: "/about" },
];

function PublicHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  const userName =
    user?.displayName?.trim() || user?.email?.split("@")[0] || "Profile";

  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  useEffect(() => {
    setSearchOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  function handleNavigate(path: string) {
    navigate(path);
    setMobileOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
  }

  const headerSurfaceClasses = isHome
    ? scrolled
      ? [
          "bg-[color-mix(in_srgb,var(--color-background)_92%,transparent)]",
          "backdrop-blur-[14px]",
          "shadow-[var(--shadow-xs)]",
        ]
      : [
          "bg-[color-mix(in_srgb,var(--color-background)_72%,transparent)]",
          "backdrop-blur-[12px]",
        ]
    : ["bg-[var(--color-background)]", "backdrop-blur-[10px]"];

  return (
    <header
      className={[
        "z-[var(--z-header)] w-full",
        isHome ? "absolute left-0 top-0" : "sticky top-0",
        "border-b border-[var(--color-outline-variant)]",
        "transition-[background-color,backdrop-filter,box-shadow]",
        "duration-[var(--motion-normal)]",
        ...headerSurfaceClasses,
      ].join(" ")}
    >
      <div className="mx-auto max-w-[var(--canvas-width)] px-5 sm:px-8 lg:px-10">
        <div className="relative flex h-[74px] items-center justify-between">
          <button
            type="button"
            aria-label="Go to Folio home"
            onClick={() => handleNavigate("/")}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span
              className={[
                "flex h-9 w-9 items-center justify-center",
                "rounded-[5px]",
                "!bg-[var(--color-primary)]",
                "!text-[var(--color-on-primary)]",
                "shadow-[var(--shadow-xs)]",
                "transition-transform duration-[var(--motion-fast)]",
                "group-hover:-translate-y-0.5",
              ].join(" ")}
            >
              <span className="font-display text-[18px] font-semibold leading-none">
                F
              </span>
            </span>

            <span className="font-display text-[22px] font-semibold tracking-[-0.02em] text-[var(--color-on-surface)]">
              Folio
            </span>
          </button>

          <nav
            aria-label="Primary navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex"
          >
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={[
                    "relative px-4 py-2",
                    "font-body text-[13px] font-medium",
                    "transition-colors duration-[var(--motion-fast)]",
                    isActive
                      ? "text-[var(--color-on-surface)]"
                      : "text-[var(--color-on-surface-variant)]",
                    "hover:text-[var(--color-on-surface)]",
                  ].join(" ")}
                >
                  {item.label}

                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 h-px w-5 -translate-x-1/2 bg-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center lg:flex">
            {isHome ? (
              searchOpen ? (
                <div className="flex h-9 w-[210px] items-center rounded-[5px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3 shadow-[var(--shadow-xs)]">
                  <Icon
                    name="search"
                    size={16}
                    className="shrink-0 text-[var(--color-on-surface-variant)]"
                  />

                  <input
                    autoFocus
                    type="search"
                    aria-label="Search stories"
                    placeholder="Search stories..."
                    className="ml-2 min-w-0 flex-1 border-0 bg-transparent font-body text-[12px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)]"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setSearchOpen(false);
                      }
                    }}
                  />

                  <button
                    type="button"
                    aria-label="Close search"
                    title="Close search"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 flex items-center justify-center text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-on-surface)]"
                  >
                    <Icon name="x" size={15} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Open story search"
                  title="Search stories"
                  onClick={() => {
                    setSearchOpen(true);
                    setProfileOpen(false);
                  }}
                  className={[
                    "group flex h-9 w-[180px] items-center",
                    "rounded-[5px]",
                    "border border-[var(--color-outline-variant)]",
                    "bg-[color-mix(in_srgb,var(--color-surface)_48%,transparent)]",
                    "px-3",
                    "backdrop-blur-[4px]",
                    "transition-[background-color,border-color]",
                    "duration-[var(--motion-fast)]",
                    "hover:bg-[var(--color-surface)]",
                    "hover:border-[var(--color-outline)]",
                  ].join(" ")}
                >
                  <Icon
                    name="search"
                    size={17}
                    className="shrink-0 text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)] group-hover:text-[var(--color-on-surface)]"
                  />

                  <span className="ml-2.5 font-body text-[11px] text-[var(--color-on-surface-variant)]">
                    Search stories...
                  </span>
                </button>
              )
            ) : searchOpen ? (
              <div className="flex h-9 items-center rounded-[5px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3 shadow-[var(--shadow-xs)]">
                <Icon
                  name="search"
                  size={16}
                  className="shrink-0 text-[var(--color-on-surface-variant)]"
                />

                <input
                  autoFocus
                  type="search"
                  aria-label="Search stories"
                  placeholder="Search stories..."
                  className="ml-2 w-32 border-0 bg-transparent font-body text-[12px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)]"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setSearchOpen(false);
                    }
                  }}
                />

                <button
                  type="button"
                  aria-label="Close search"
                  title="Close search"
                  onClick={() => setSearchOpen(false)}
                  className="ml-2 flex items-center justify-center text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-on-surface)]"
                >
                  <Icon name="x" size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-label="Search stories"
                title="Search stories"
                onClick={() => {
                  setSearchOpen(true);
                  setProfileOpen(false);
                }}
                className={[
                  "flex h-9 w-9 items-center justify-center",
                  "rounded-[5px]",
                  "text-[var(--color-on-surface-variant)]",
                  "transition-[background-color,color]",
                  "duration-[var(--motion-fast)]",
                  "hover:bg-[var(--color-surface-container-low)]",
                  "hover:text-[var(--color-on-surface)]",
                ].join(" ")}
              >
                <Icon name="search" size={18} />
              </button>
            )}

            <span
              className="mx-3 h-5 w-px bg-[var(--color-outline-variant)]"
              aria-hidden="true"
            />

            {user ? (
              <div className="relative flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleNavigate("/dashboard")}
                  className="px-3 py-2 font-body text-[12px] font-semibold text-[var(--color-on-surface)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-primary)]"
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  title={userName}
                  onClick={() => {
                    setProfileOpen((value) => !value);
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface)] py-1 pl-1 pr-2.5 shadow-[var(--shadow-xs)] transition-[background-color,border-color] duration-[var(--motion-fast)] hover:border-[var(--color-outline)] hover:bg-[var(--color-surface-container-low)]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full !bg-[var(--color-primary)] !text-[var(--color-on-primary)] font-body text-[10px] font-bold">
                    {userInitial}
                  </span>

                  <span className="max-w-20 truncate font-body text-[12px] font-medium text-[var(--color-on-surface)]">
                    {userName}
                  </span>

                  <Icon
                    name="chevron-down"
                    size={14}
                    className={[
                      "text-[var(--color-on-surface-variant)]",
                      "transition-transform duration-[var(--motion-fast)]",
                      profileOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-48 overflow-hidden rounded-[7px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-1.5 shadow-[var(--shadow-md)]">
                    <div className="border-b border-[var(--color-outline-variant)] px-3 py-2.5">
                      <p className="truncate font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                        {userName}
                      </p>

                      <p className="mt-0.5 truncate font-body text-[10px] text-[var(--color-on-surface-variant)]">
                        {user?.email ?? ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavigate("/profile")}
                      className="mt-1 flex w-full rounded-[5px] px-3 py-2.5 text-left font-body text-[12px] font-medium text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)]"
                    >
                      Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate("/dashboard")}
                      className="flex w-full rounded-[5px] px-3 py-2.5 text-left font-body text-[12px] font-medium text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)]"
                    >
                      Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate("/settings")}
                      className="flex w-full rounded-[5px] px-3 py-2.5 text-left font-body text-[12px] font-medium text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)]"
                    >
                      Settings
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate("/login")}
                  className="px-3 py-2 font-body text-[13px] font-medium text-[var(--color-on-surface)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-primary)]"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/signup")}
                  className="h-9 rounded-[5px] !bg-[var(--color-primary)] px-4 font-body text-[12px] font-semibold !text-[var(--color-on-primary)] shadow-[var(--shadow-xs)] transition-[background-color,transform] duration-[var(--motion-fast)] hover:!bg-[var(--color-primary-container)] active:translate-y-px"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            title={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => {
              setMobileOpen((value) => !value);
              setProfileOpen(false);
              setSearchOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-[5px] text-[var(--color-on-surface-variant)] transition-[background-color,color] duration-[var(--motion-fast)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)] lg:hidden"
          >
            <Icon name={mobileOpen ? "x" : "menu"} size={19} />
          </button>
        </div>

        <div
          className={[
            "overflow-hidden lg:hidden",
            "transition-[max-height,opacity]",
            "duration-[var(--motion-normal)]",
            mobileOpen ? "max-h-[560px] pb-5 opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className="border-t border-[var(--color-outline-variant)] pt-4">
            {isHome && (
              <div className="mb-3">
                <div className="flex h-10 items-center rounded-[5px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3">
                  <Icon
                    name="search"
                    size={16}
                    className="text-[var(--color-on-surface-variant)]"
                  />

                  <input
                    type="search"
                    aria-label="Search stories"
                    placeholder="Search stories..."
                    className="ml-2 min-w-0 flex-1 border-0 bg-transparent font-body text-[12px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)]"
                  />
                </div>
              </div>
            )}

            <nav aria-label="Mobile navigation" className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className={[
                      "flex w-full items-center justify-between rounded-[5px]",
                      "px-3 py-2.5 text-left",
                      "font-body text-[13px] font-medium",
                      isActive
                        ? "bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]"
                        : "text-[var(--color-on-surface-variant)]",
                      "transition-colors duration-[var(--motion-fast)]",
                      "hover:bg-[var(--color-surface-container-low)]",
                      "hover:text-[var(--color-on-surface)]",
                    ].join(" ")}
                  >
                    {item.label}

                    {isActive && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-3 border-t border-[var(--color-outline-variant)] pt-3">
              {user ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavigate("/dashboard")}
                    className="h-10 rounded-[5px] border border-[var(--color-outline-variant)] font-body text-[12px] font-semibold text-[var(--color-on-surface)]"
                  >
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate("/profile")}
                    className="h-10 rounded-[5px] !bg-[var(--color-primary)] font-body text-[12px] font-semibold !text-[var(--color-on-primary)]"
                  >
                    Profile
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavigate("/login")}
                    className="h-10 rounded-[5px] border border-[var(--color-outline-variant)] font-body text-[12px] font-semibold text-[var(--color-on-surface)]"
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate("/signup")}
                    className="h-10 rounded-[5px] !bg-[var(--color-primary)] font-body text-[12px] font-semibold !text-[var(--color-on-primary)]"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;
