import { NavLink } from "react-router-dom";
import { Icon } from "../../ui/Icon/Icon";
import type { IconName } from "../../ui/Icon/Icon";

interface SidebarItemProps {
  label: string;
  path: string;
  icon: IconName;
  collapsed?: boolean;
}

export function SidebarItem({
  label,
  path,
  icon,
  collapsed = false,
}: SidebarItemProps) {
  const isExactRoute =
    path === "/dashboard" ||
    path === "/posts" ||
    path === "/posts/new" ||
    path === "/categories" ||
    path === "/media" ||
    path === "/comments" ||
    path === "/analytics" ||
    path === "/users" ||
    path === "/settings";

  return (
    <NavLink
      to={path}
      end={isExactRoute}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          "group flex min-h-9 items-center rounded-[var(--radius-md)]",
          "font-body text-[13px] font-medium",
          "transition-[background-color,color,transform]",
          "duration-[var(--motion-fast)]",
          "ease-[var(--ease-standard)]",
          "focus-visible:outline-2",
          "focus-visible:outline-[var(--color-primary)]",
          "focus-visible:outline-offset-2",
          collapsed ? "justify-center px-2" : "gap-2 px-3",
          isActive
            ? [
                "bg-[var(--color-primary)]",
                "text-[var(--color-on-primary)]",
                "font-semibold",
              ].join(" ")
            : [
                "text-[var(--color-on-surface-variant)]",
                "hover:bg-[var(--color-surface-container-high)]",
                "hover:text-[var(--color-on-surface)]",
                "active:translate-y-px",
              ].join(" "),
        ].join(" ")
      }
    >
      <Icon name={icon} size={18} strokeWidth={1.8} className="shrink-0" />

      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

export default SidebarItem;
