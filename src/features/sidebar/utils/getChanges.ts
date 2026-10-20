import type {
  Profile,
  UpdateProfileValues,
} from "@/features/sidebar/types/profile";

export function getChanges(
  original: Profile,
  edited: UpdateProfileValues,
): UpdateProfileValues {
  return Object.fromEntries(
    Object.entries(edited).filter(
      ([key, value]) =>
        value !== undefined && value !== original[key as keyof Profile],
    ),
  ) as UpdateProfileValues;
}
