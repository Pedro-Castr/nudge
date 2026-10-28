"use client";

import { THEMES, type ThemeId } from "@/features/sidebar/types/theme";
import styles from "./themePicker.module.css";

function applyTheme(color: ThemeId) {
  const root = document.querySelector<HTMLElement>("[data-theme-root]");
  if (root) root.dataset.color = color;
  document.cookie = `nudge-theme=${color}; path=/; max-age=31536000; samesite=lax`;
}

interface ThemePickerProps {
  theme: ThemeId;
}

export default function ThemePicker({ theme }: ThemePickerProps) {
  return (
    <fieldset
      className={styles.root}
      aria-labelledby="theme-title"
      aria-describedby="theme-description"
    >
      <header className={styles.header}>
        <h2 id="theme-title" className={styles.title}>
          Temas
        </h2>
        <p id="theme-description" className={styles.description}>
          Personalize o nugde para combinar mais com você
        </p>
      </header>

      <div className={styles.grid}>
        {THEMES.map((color) => (
          <label key={color} data-color={color} className={styles.option}>
            <input
              type="radio"
              name="tema"
              value={color}
              defaultChecked={color === theme}
              onChange={() => applyTheme(color)}
              className={styles.input}
            />
            <span className={styles.swatch} />
            <span className={styles.name}>{color}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
