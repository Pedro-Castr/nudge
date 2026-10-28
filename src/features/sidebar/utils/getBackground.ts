import { cookies } from "next/headers";

import { BACKGROUNDS, type BackgroundId } from "@/features/sidebar/types/theme";

export async function getBackground(): Promise<BackgroundId> {
  const saved = (await cookies()).get("nudge-background")?.value;
  return BACKGROUNDS.includes(saved as BackgroundId)
    ? (saved as BackgroundId)
    : "symbol";
}
