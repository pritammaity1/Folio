import { useState } from "react";
import { Icon } from "../../ui/Icon/Icon";
import { navigation } from "../../../config/navigation";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={[
        "sticky top-0 hidden h-dvh shrink-0 self-start",
        "flex-col overflow-hidden",
        "border-r border-[var(--color-outline-variant)]",
        "bg-[var(--color-surface-container-low)]",
        "lg:flex",
        "transition-[width]",
        "duration-[var(--motion-slow)]",
        "ease-[var(--ease-standard)]",
        collapsed ? "w-[72px]" : "w-[218px]",
      ].join(" ")}
    >
      {/* Sidebar header */}
      <div
        className={[
          "relative flex h-16 min-h-16 shrink-0 items-center",
          "border-b border-[var(--color-outline-variant)]",
          collapsed ? "justify-center" : "justify-between px-4",
        ].join(" ")}
      >
        {collapsed ? (
          <>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-on-primary)]">
              <span className="font-display text-sm font-semibold">F</span>
            </div>

            <button
              type="button"
              aria-label="Expand sidebar"
              title="Expand sidebar"
              onClick={() => setCollapsed(false)}
              className={[
                "absolute -right-1.5 top-1/2",
                "-translate-y-1/2",
                "flex h-8 w-8 shrink-0 items-center justify-center",
                "rounded-[var(--radius-md)]",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface-container-high)]",
                "hover:text-[var(--color-on-surface)]",
                "focus-visible:outline-2",
                "focus-visible:outline-[var(--color-primary)]",
                "focus-visible:outline-offset-2",
              ].join(" ")}
            >
              <Icon name="chevron-right" size={18} />
            </button>
          </>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-on-primary)]">
                <span className="font-display text-sm font-semibold">F</span>
              </div>

              <span className="truncate font-display text-[19px] font-semibold tracking-tight text-[var(--color-on-surface)]">
                Folio
              </span>
            </div>

            <button
              type="button"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              onClick={() => setCollapsed(true)}
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center",
                "rounded-[var(--radius-md)]",
                "text-[var(--color-on-surface-variant)]",
                "transition-[background-color,color]",
                "duration-[var(--motion-fast)]",
                "hover:bg-[var(--color-surface-container-high)]",
                "hover:text-[var(--color-on-surface)]",
                "focus-visible:outline-2",
                "focus-visible:outline-[var(--color-primary)]",
                "focus-visible:outline-offset-2",
              ].join(" ")}
            >
              <Icon name="chevron-left" size={18} />
            </button>
          </>
        )}
      </div>

      {/* Workspace selector */}
      <div
        className={[
          "flex h-12 min-h-12 shrink-0 items-center",
          collapsed ? "justify-center" : "px-2",
        ].join(" ")}
      >
        {collapsed ? (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            <Icon
              name="chevron-down"
              size={17}
              className="!text-[var(--color-on-surface-variant)]"
            />
          </div>
        ) : (
          <button
            type="button"
            aria-label="Select workspace"
            className={[
              "flex h-9 w-full items-center justify-between",
              "rounded-[var(--radius-md)]",
              "bg-[var(--color-surface-container)]",
              "px-2.5",
              "transition-[background-color]",
              "duration-[var(--motion-fast)]",
              "hover:bg-[var(--color-surface-container-high)]",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--color-primary)]",
              "focus-visible:outline-offset-2",
            ].join(" ")}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]"
                aria-hidden="true"
              />

              <span className="truncate font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                Folio Studio
              </span>
            </span>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center">
              <Icon
                name="chevron-down"
                size={17}
                className="!text-[var(--color-on-surface-variant)]"
              />
            </span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        aria-label="Primary navigation"
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-3"
      >
        {navigation.map((section) => (
          <SidebarSection
            key={section.label}
            label={section.label}
            collapsed={collapsed}
          >
            {section.items.map((item) => (
              <SidebarItem
                key={item.path}
                label={item.label}
                path={item.path}
                icon={item.icon}
                collapsed={collapsed}
              />
            ))}
          </SidebarSection>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
