/** Tiny event bus so server-rendered buttons can talk to client widgets without shared React state. */
export const OPEN_PALETTE = "portfolio:open-palette";
export const TOAST = "portfolio:toast";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST, { detail: message }));
}

export const REQUEST_PALETTE = "portfolio:request-palette";

/** Shared between the lazily-loaded palette and its loader so no open request is lost mid-download. */
export const paletteState = { mounted: false, wanted: false };

export function openPalette() {
  if (paletteState.mounted) {
    window.dispatchEvent(new Event(OPEN_PALETTE));
  } else {
    paletteState.wanted = true;
    window.dispatchEvent(new Event(REQUEST_PALETTE));
  }
}

export type Theme = "dark" | "light";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f5f7fb" : "#0b1120");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage blocked: theme still applies for this visit */
  }
  window.dispatchEvent(new CustomEvent("portfolio:theme", { detail: theme }));
}

export function toggleTheme() {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts without the async clipboard API.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/** Inline, render-blocking on purpose: sets the theme before first paint so there is no flash. */
export const themeInitScript = `try{if(location.hash)document.documentElement.classList.add("cv-all");var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;if(t==="light"){var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute("content","#f5f7fb")}}}catch(e){}`;

/** Render every section for real so an in-page jump measures true positions (see .section-shell CSS). */
export function renderAllSections() {
  document.documentElement.classList.add("cv-all");
}
