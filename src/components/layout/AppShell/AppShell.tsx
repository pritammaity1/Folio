import type { ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import MobileNavigation from "../MobileNavigation/MobileNavigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[var(--canvas-width)] px-[var(--content-padding-mobile)] py-[var(--content-padding-mobile)] sm:px-[var(--content-padding-tablet)] sm:py-[var(--content-padding-tablet)] lg:px-[var(--content-padding-desktop)] lg:py-[var(--content-padding-desktop)]">
            {children}
          </div>
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}

export default AppShell;
