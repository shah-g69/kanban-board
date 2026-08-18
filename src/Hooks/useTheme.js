import { useEffect, useRef, useState } from "react";

const THEME_KEY = "kanban:theme";

// Applied to <html> while the theme flips so the hundreds of element color
// transitions don't animate at once and make the switch feel laggy.
const THEME_NO_TRANSITION_CLASS = "theme-no-transition";

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
  } catch {
    // Storage unavailable — fall through to system preference.
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);
  const hasApplied = useRef(false);

  function persistTheme(nextTheme) {
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // Storage unavailable — the toggle still works for this session.
    }
  }

  useEffect(() => {
    const root = document.documentElement;

    if (!hasApplied.current) {
      // Initial paint: apply the saved/system theme right away and leave
      // entrance animations (cards, empty state) intact.
      hasApplied.current = true;
      root.classList.toggle("dark", theme === "dark");
      persistTheme(theme);
      return;
    }

    // User toggle: disable transitions for one frame so the switch snaps
    // instead of stuttering across every element, then re-enable them.
    root.classList.add(THEME_NO_TRANSITION_CLASS);
    root.classList.toggle("dark", theme === "dark");
    persistTheme(theme);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove(THEME_NO_TRANSITION_CLASS);
      });
    });
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme };
}
