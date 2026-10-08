"use client";

import { registerUser } from "@/features/auth/services/authService";
import AuthForm from "@/features/auth/components/authForm";
import { type Mode, type AuthValues } from "@/features/auth/types/auth";

import styles from "./authPage.module.css";

type PreviewState = "urgent" | "dragging" | "idle";

interface PreviewTask {
  id: number;
  title: string;
  when: string;
  state: PreviewState;
}

const PREVIEW_TASKS: PreviewTask[] = [
  {
    id: 1,
    title: "Pagar o boleto do condomínio",
    when: "Hoje, 18:00",
    state: "urgent",
  },
  {
    id: 2,
    title: "Ligar para o dentista",
    when: "Amanhã, 09:00",
    state: "dragging",
  },
  {
    id: 3,
    title: "Comprar presente de aniversário",
    when: "Sexta, 12:00",
    state: "idle",
  },
];

const TASK_STATE_CLASS: Record<PreviewState, string> = {
  urgent: styles.taskUrgent,
  dragging: styles.taskDragging,
  idle: "",
};

const PROMISES = [
  "Anote em segundos",
  "Arraste para priorizar",
  "Lembrete na hora certa",
];

function Logo() {
  return (
    <div className={styles.logo}>
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="12" cy="20" r="5" fill="currentColor" fillOpacity="0.45" />
        <circle cx="25" cy="20" r="10" fill="currentColor" />
      </svg>
      <span className={styles.logoWord}>nudge</span>
    </div>
  );
}

function HandleIcon() {
  return (
    <svg
      className={styles.taskHandle}
      width="14"
      height="20"
      viewBox="0 0 14 20"
      aria-hidden="true"
    >
      {[4, 10, 16].flatMap((cy) =>
        [4, 10].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" />
        )),
      )}
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function TaskPreview() {
  return (
    <div className={styles.preview} aria-hidden="true">
      {PREVIEW_TASKS.map((task) => (
        <div
          key={task.id}
          className={`${styles.task} ${TASK_STATE_CLASS[task.state]}`}
        >
          <HandleIcon />
          <span className={styles.taskRank}>{task.id}</span>
          <div className={styles.taskBody}>
            <span className={styles.taskTitle}>{task.title}</span>
            <span className={styles.taskWhen}>
              <ClockIcon />
              {task.when}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AuthPage() {
  async function handleAuthSubmit(mode: Mode, values: AuthValues) {
    if (mode === "signup") {
      await registerUser(values);
    }
  }

  return (
    <main className={styles.auth}>
      <section className={styles.brand}>
        <div className={styles.brandDots} />
        <div className={styles.brandRipples} aria-hidden="true">
          <span className={styles.ripple} />
          <span className={`${styles.ripple} ${styles.ripple2}`} />
          <span className={`${styles.ripple} ${styles.ripple3}`} />
        </div>

        <Logo />

        <div className={styles.brandContent}>
          <h1 className={styles.brandTitle}>
            Um empurrãozinho para você nunca esquecer.
          </h1>
          <p className={styles.brandText}>
            Anote em segundos, arraste para decidir o que vem primeiro e deixe o
            resto com a gente.
          </p>
          <TaskPreview />
        </div>

        <ul className={styles.promises}>
          {PROMISES.map((promise) => (
            <li key={promise}>{promise}</li>
          ))}
        </ul>
      </section>

      <AuthForm onSubmit={handleAuthSubmit} />
    </main>
  );
}
