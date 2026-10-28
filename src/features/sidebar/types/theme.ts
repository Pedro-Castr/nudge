export const THEMES = [
  "azul",
  "verde",
  "roxo",
  "vermelho",
  "laranja",
  "rosa",
  "turquesa",
  "grafite",
] as const;

export const BACKGROUNDS = ["symbol", "stain", "waves"] as const;

export type ThemeId = (typeof THEMES)[number];

export type BackgroundId = (typeof BACKGROUNDS)[number];

export const isBackgroundId = (value: unknown): value is BackgroundId =>
  BACKGROUNDS.includes(value as BackgroundId);
