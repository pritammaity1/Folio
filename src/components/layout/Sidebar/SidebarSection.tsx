import type { ReactNode } from "react";

interface SidebarSectionProps {
  label: string;
  children: ReactNode;
  collapsed?: boolean;
}

export function SidebarSection({
  label,
  children,
  collapsed = false,
}: SidebarSectionProps) {
  return (
    <section className="mb-3 last:mb-0">
      {!collapsed && (
        <h2 className="px-3 pb-1.5 pt-3 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-surface-variant)]">
          {label}
        </h2>
      )}

      <div className="space-y-0.5">{children}</div>
    </section>
  );
}

export default SidebarSection;
