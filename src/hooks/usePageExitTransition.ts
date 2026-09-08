import { useCallback, useState } from "react";

interface NavigateWithTransitionOptions {
  onNavigate: () => void;
  duration?: number;
}

export function usePageExitTransition() {
  const [isExiting, setIsExiting] = useState(false);

  const navigateWithTransition = useCallback(
    ({ onNavigate, duration = 360 }: NavigateWithTransitionOptions) => {
      if (isExiting) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        onNavigate();
        return;
      }

      setIsExiting(true);

      window.setTimeout(() => {
        onNavigate();
      }, duration);
    },
    [isExiting],
  );

  return {
    isExiting,
    navigateWithTransition,
  };
}

export default usePageExitTransition;
