"use client";

import { useEffect, useMemo, useState } from "react";

import type { GreetingPart } from "@/features/task/utils/greetings";

import styles from "./taskGreeting.module.css";

const START_DELAY_MS = 35;
const CHAR_DELAY_MS = 7;

interface TaskGreetingProps {
  parts: GreetingPart[];
}

export default function TaskGreeting({ parts }: TaskGreetingProps) {
  const [greeting] = useState(parts);
  const [typed, setTyped] = useState(0);

  const fullText = useMemo(
    () => greeting.map((part) => part.text).join(""),
    [greeting],
  );
  const total = fullText.length;

  useEffect(() => {
    let count = 0;
    let timer: number;

    const tick = () => {
      count += 1;
      setTyped(count);

      if (count < total) {
        const delay = CHAR_DELAY_MS;
        timer = window.setTimeout(tick, delay);
      }
    };

    timer = window.setTimeout(tick, START_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [total]);

  const done = typed >= total;

  return (
    <h1 className={styles.greeting}>
      <span className={styles.srOnly}>{fullText}</span>

      <span aria-hidden="true">
        {greeting.map((part, index) => {
          const start = greeting
            .slice(0, index)
            .reduce((sum, previous) => sum + previous.text.length, 0);

          const length = part.text.length;
          const visibleCount = Math.max(0, Math.min(length, typed - start));
          const hasCaret = typed > start && typed <= start + length;

          return (
            <span
              key={index}
              className={part.highlight ? styles.highlight : undefined}
            >
              <span
                className={
                  hasCaret
                    ? `${styles.caret} ${done ? styles.caretDone : ""}`
                    : undefined
                }
              >
                {part.text.slice(0, visibleCount)}
              </span>
              <span className={styles.pending}>
                {part.text.slice(visibleCount)}
              </span>
            </span>
          );
        })}
      </span>
    </h1>
  );
}
