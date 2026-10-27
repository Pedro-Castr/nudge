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

export type ThemeId = (typeof THEMES)[number];
