"use client";

import { useRouter } from "next/navigation";
import { BACKGROUNDS, type BackgroundId } from "@/features/sidebar/types/theme";
import styles from "./backgroundPicker.module.css";

const LABELS: Record<BackgroundId, string> = {
  symbol: "Símbolo",
  stain: "Manchas",
  waves: "Ondas",
};

function saveBackground(background: BackgroundId) {
  document.cookie = `nudge-background=${background}; path=/; max-age=31536000; samesite=lax`;
}

interface BackgroundPickerProps {
  background: BackgroundId;
}

export default function BackgroundPicker({
  background,
}: BackgroundPickerProps) {
  const router = useRouter();

  function choose(id: BackgroundId) {
    saveBackground(id);
    router.refresh();
  }

  return (
    <fieldset
      className={styles.root}
      aria-labelledby="background-title"
      aria-describedby="background-description"
    >
      <header className={styles.header}>
        <h2 id="background-title" className={styles.title}>
          Planos de Fundo
        </h2>
      </header>

      <div className={styles.grid}>
        {BACKGROUNDS.map((id) => (
          <label key={id} className={styles.option}>
            <input
              type="radio"
              name="fundo"
              value={id}
              defaultChecked={id === background}
              onChange={() => choose(id)}
              className={styles.input}
            />
            <span className={`${styles.preview} ${styles[id]}`} />
            <span className={styles.name}>{LABELS[id]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
