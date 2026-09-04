import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/posts": "Posts",
  "/posts/new": "New Post",
  "/categories": "Categories",
  "/media": "Media",
  "/comments": "Comments",
  "/analytics": "Analytics",
  "/users": "Users",
  "/settings": "Settings",
  "/profile": "Profile",
};

function getPageTitle(pathname: string) {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  if (pathname.includes("/posts/") && pathname.endsWith("/edit")) {
    return "Edit Post";
  }

  if (pathname.includes("/posts/")) {
    return "Post";
  }

  if (pathname.startsWith("/settings/")) {
    return "Settings";
  }

  return "Folio";
}

export function Header() {
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-[var(--z-header)] flex h-[var(--header-height)] shrink-0 items-center border-b border-[var(--color-outline-variant)] bg-[var(--color-background)]/95 px-[var(--content-padding-mobile)] backdrop-blur-sm sm:px-[var(--content-padding-tablet)] lg:px-[var(--content-padding-desktop)]">
      <div className="flex min-w-0 flex-1 items-center">
        <h1 className="truncate font-display text-[var(--text-headline-sm-size)] font-semibold leading-[var(--text-headline-sm-line-height)] tracking-[var(--tracking-tight)] text-[var(--color-on-surface)]">
          {pageTitle}
        </h1>
      </div>

      <div className="flex shrink-0 items-center">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-container)] font-body text-xs font-semibold text-[var(--color-on-primary)]"
          aria-label="User profile"
        >
          P
        </div>
      </div>
    </header>
  );
}

export default Header;
