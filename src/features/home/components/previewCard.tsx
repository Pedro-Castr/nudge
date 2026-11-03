"use client";

import { useState } from "react";
import { tasksMokup } from "@/features/task/utils/random";
import { FaCheck, FaGripVertical } from "react-icons/fa6";

import styles from "./previewCard.module.css";

export default function PreviewCard() {
  const [nome] = useState(() =>
    [...tasksMokup].sort(() => Math.random() - 0.5).slice(0, 3),
  );

  return (
    <div className={styles.preview} aria-hidden="true">
      <ul className={styles.previewList}>
        <li className={styles.card}>
          <span className={styles.handle}>
            <FaGripVertical />
          </span>
          <span className={styles.name} suppressHydrationWarning>
            {nome[0]}
          </span>
          <span className={styles.check}>
            <FaCheck />
          </span>
        </li>

        <li className={`${styles.card} ${styles.dragging}`}>
          <span className={styles.handle}>
            <FaGripVertical />
          </span>
          <span className={styles.name} suppressHydrationWarning>
            {nome[1]}
          </span>
          <span className={styles.check}>
            <FaCheck />
          </span>
        </li>

        <li className={styles.slot} />

        <li className={styles.card}>
          <span className={styles.handle}>
            <FaGripVertical />
          </span>
          <span className={styles.name} suppressHydrationWarning>
            {nome[2]}
          </span>
          <span className={styles.check}>
            <FaCheck />
          </span>
        </li>
      </ul>
    </div>
  );
}
