import { cookies } from "next/headers";
import { THEMES, type ThemeId } from "@/features/sidebar/types/theme";

export async function getTheme(): Promise<ThemeId> {
  const saved = (await cookies()).get("nudge-theme")?.value;
  return THEMES.includes(saved as ThemeId) ? (saved as ThemeId) : "azul";
}
