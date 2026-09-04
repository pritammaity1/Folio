import { NavLink } from "react-router-dom";
import { navigation } from "../../../config/navigation";
import { Icon } from "../../ui/Icon/Icon";

const mobileItems = [
  navigation[0].items[0],
  navigation[1].items[0],
  navigation[1].items[1],
  navigation[3].items[0],
  navigation[4].items[0],
];

export function MobileNavigation() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-[var(--z-mobile-navigation)] border-t border-[var(--color-outline-variant)] bg-[var(--color-surface)]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex h-[var(--mobile-navigation-height)] max-w-lg items-center justify-around gap-1">
        {mobileItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1",
                "rounded-[var(--radius-md)] px-1 py-1",
                "font-body text-[10px] font-medium",
                "transition-[background-color,color,transform]",
                "duration-[var(--motion-fast)]",
                "ease-[var(--ease-standard)]",
                "focus-visible:outline-2",
                "focus-visible:outline-[var(--color-primary)]",
                "focus-visible:outline-offset-2",
                isActive
                  ? "text-[var(--color-primary)]"
                  : [
                      "text-[var(--color-on-surface-variant)]",
                      "hover:bg-[var(--color-surface-container-low)]",
                      "hover:text-[var(--color-on-surface)]",
                      "active:translate-y-px",
                    ].join(" "),
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  name={item.icon}
                  size={19}
                  strokeWidth={isActive ? 2 : 1.8}
                />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default MobileNavigation;
