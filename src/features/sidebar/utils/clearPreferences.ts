export function clearPreferences() {
  document.cookie = "nudge-background=; path=/; max-age=0";
  document.cookie = "nudge-theme=; path=/; max-age=0";
}
