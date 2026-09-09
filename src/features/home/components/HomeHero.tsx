import { useNavigate } from "react-router-dom";
import homeHeroImage from "../../../assets/images/home_hero_image.png";
import { Icon } from "../../../components/ui/Icon/Icon";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePageExitTransition } from "../../../hooks/usePageExitTransition";

const principles = [
  {
    icon: "book-open" as const,
    label: "Independent",
    sublabel: "voices",
  },
  {
    icon: "leaf" as const,
    label: "Thoughtful",
    sublabel: "essays",
  },
  {
    icon: "users" as const,
    label: "Work that",
    sublabel: "lasts",
  },
];

function HomeHero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { isExiting, navigateWithTransition } = usePageExitTransition();

  function handleStartWriting() {
    navigateWithTransition({
      onNavigate: () => {
        navigate(user ? "/posts/new" : "/login");
      },
    });
  }

  function handleExploreStories() {
    navigateWithTransition({
      onNavigate: () => {
        navigate("/blog");
      },
    });
  }

  return (
    <section
      className={[
        "relative min-h-dvh overflow-hidden",
        "transition-[filter,transform,opacity]",
        "duration-[360ms]",
        "ease-[var(--ease-standard)]",
        isExiting ? "scale-[1.008] opacity-0" : "scale-100 opacity-100",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-cover bg-center bg-no-repeat",
          "transition-[transform,filter]",
          "duration-[500ms]",
          "ease-[var(--ease-standard)]",
          isExiting
            ? "scale-[1.025] brightness-[1.04]"
            : "scale-100 brightness-100",
        ].join(" ")}
        style={{
          backgroundImage: `url(${homeHeroImage})`,
        }}
        aria-hidden="true"
      />

      <div
        className={[
          "pointer-events-none absolute inset-0",
          "bg-[linear-gradient(90deg,rgba(249,249,254,0.03)_0%,rgba(249,249,254,0.01)_42%,rgba(249,249,254,0)_68%)]",
          "transition-opacity duration-[360ms]",
          isExiting ? "opacity-0" : "opacity-100",
        ].join(" ")}
        aria-hidden="true"
      />

      <div
        className={[
          "relative z-10 mx-auto flex min-h-dvh max-w-[var(--canvas-width)]",
          "items-center px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16",
          "transition-[transform,opacity]",
          "duration-[360ms]",
          "ease-[var(--ease-standard)]",
          isExiting ? "-translate-x-4 opacity-0" : "translate-x-0 opacity-100",
        ].join(" ")}
      >
        <div className="w-full max-w-[660px] -translate-y-5 lg:-translate-y-4">
          <div className="flex items-center gap-3 animate-[card-enter_500ms_var(--ease-standard)_both]">
            <span
              className="h-px w-8 bg-[var(--color-primary)]"
              aria-hidden="true"
            />

            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              The Folio Journal
            </p>
          </div>

          <h1
            className={[
              "mt-5 max-w-[660px]",
              "font-display text-[46px] leading-[0.99]",
              "tracking-[-0.03em]",
              "text-[var(--color-on-surface)]",
              "sm:text-[58px]",
              "lg:text-[68px]",
              "animate-[card-enter_650ms_var(--ease-standard)_both]",
              "delay-75",
            ].join(" ")}
          >
            Stories worth reading.
            <br />
            <span className="italic text-[var(--color-primary)]">
              Ideas worth keeping.
            </span>
          </h1>

          <p
            className={[
              "mt-6 max-w-[560px]",
              "font-body text-[15px] leading-7",
              "text-[var(--color-on-surface-variant)]",
              "sm:text-[16px] sm:leading-7",
              "animate-[card-enter_650ms_var(--ease-standard)_both]",
              "delay-150",
            ].join(" ")}
          >
            A calm editorial space for thoughtful writing, independent
            publishing, and stories that deserve more than a passing glance.
          </p>

          <div
            className={[
              "mt-8 flex flex-wrap items-center gap-6",
              "animate-[card-enter_650ms_var(--ease-standard)_both]",
              "delay-200",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={handleExploreStories}
              disabled={isExiting}
              className={[
                "group inline-flex h-11 items-center gap-2",
                "rounded-[5px]",
                "!bg-[var(--color-primary)]",
                "px-5",
                "font-body text-[13px] font-semibold",
                "!text-[var(--color-on-primary)]",
                "shadow-[var(--shadow-sm)]",
                "transition-[background-color,transform,box-shadow,opacity]",
                "duration-[var(--motion-fast)]",
                "hover:!bg-[var(--color-primary-container)]",
                "hover:shadow-[var(--shadow-md)]",
                "active:translate-y-px",
                "disabled:cursor-not-allowed",
                "disabled:opacity-70",
              ].join(" ")}
            >
              Explore stories
              <span
                aria-hidden="true"
                className={[
                  "text-[15px]",
                  "transition-transform duration-[var(--motion-fast)]",
                  "group-hover:translate-x-1",
                ].join(" ")}
              >
                →
              </span>
            </button>

            <button
              type="button"
              onClick={handleStartWriting}
              disabled={isExiting}
              className={[
                "group inline-flex items-center gap-2",
                "font-body text-[13px] font-semibold",
                "text-[var(--color-on-surface)]",
                "transition-colors duration-[var(--motion-fast)]",
                "focus-visible:outline-none",
                "disabled:cursor-not-allowed",
                "disabled:opacity-70",
              ].join(" ")}
            >
              <span className="editorial-underline-link">Start writing</span>

              <span
                aria-hidden="true"
                className={[
                  "text-[15px]",
                  "transition-transform duration-[var(--motion-fast)]",
                  "group-hover:translate-x-1",
                ].join(" ")}
              >
                →
              </span>
            </button>
          </div>

          <div
            className={[
              "mt-8 flex flex-wrap items-center",
              "animate-[card-enter_650ms_var(--ease-standard)_both]",
              "delay-300",
            ].join(" ")}
          >
            {principles.map((principle, index) => (
              <div key={principle.label} className="flex items-center">
                <div className="flex items-center gap-2.5 pr-5">
                  <Icon
                    name={principle.icon}
                    size={19}
                    strokeWidth={1.45}
                    className="text-[var(--color-primary)]"
                  />

                  <span className="font-display text-[12px] leading-[1.02] text-[var(--color-on-surface-variant)]">
                    <span className="block">{principle.label}</span>

                    <span className="block">{principle.sublabel}</span>
                  </span>
                </div>

                {index < principles.length - 1 && (
                  <span
                    className="mr-5 h-6 w-px bg-[var(--color-outline-variant)] opacity-70"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={[
          "pointer-events-none fixed inset-0 z-[var(--z-modal)]",
          "bg-[var(--color-background)]",
          "origin-left",
          "transition-transform duration-[360ms]",
          "ease-[var(--ease-standard)]",
          isExiting ? "scale-x-100" : "scale-x-0",
        ].join(" ")}
        aria-hidden="true"
      />
    </section>
  );
}

export default HomeHero;
