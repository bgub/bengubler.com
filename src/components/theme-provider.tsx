import {
  createContext,
  type FigNode,
  readContext,
  useSyncExternalStore,
} from "@bgub/fig";

export type Theme = "dark" | "light" | "system";
type ResolvedTheme = Exclude<Theme, "system">;
type ThemeSnapshot = ResolvedTheme | `system-${ResolvedTheme}`;

type ThemeContextValue = {
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  theme: Theme;
};

const storageKey = "theme";
const themeChangeEvent = "theme-change";
const serverSnapshot: ThemeSnapshot = "system-light";
const themeScript = `(function(){var t='system';try{var s=localStorage.getItem('${storageKey}');if(s==='light'||s==='dark'||s==='system')t=s}catch(e){}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r})();`;

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function isTheme(value: string): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getTheme(): Theme {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored && isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getThemeSnapshot(): ThemeSnapshot {
  const theme = getTheme();
  const resolvedTheme = resolveTheme(theme);
  return theme === "system" ? `system-${resolvedTheme}` : resolvedTheme;
}

function applyTheme(theme: Theme) {
  const resolvedTheme = resolveTheme(theme);
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolvedTheme);
  document.documentElement.style.colorScheme = resolvedTheme;
}

function subscribe(onStoreChange: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const handlePreferenceChange = () => {
    if (getTheme() === "system") applyTheme("system");
    onStoreChange();
  };
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    applyTheme(getTheme());
    onStoreChange();
  };

  media.addEventListener("change", handlePreferenceChange);
  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(themeChangeEvent, onStoreChange);

  return () => {
    media.removeEventListener("change", handlePreferenceChange);
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(themeChangeEvent, onStoreChange);
  };
}

function setTheme(theme: Theme) {
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // The current document can still change theme when storage is unavailable.
  }
  applyTheme(theme);
  window.dispatchEvent(new Event(themeChangeEvent));
}

export function ThemeProvider({ children }: { children: FigNode }): FigNode {
  const snapshot = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    () => serverSnapshot,
  );
  const theme: Theme =
    snapshot === "system-dark" || snapshot === "system-light"
      ? "system"
      : snapshot;
  const resolvedTheme: ResolvedTheme =
    snapshot === "dark" || snapshot === "system-dark" ? "dark" : "light";

  return (
    <ThemeContext value={{ resolvedTheme, setTheme, theme }}>
      <script unsafeHTML={themeScript} />
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const context = readContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
