"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowRotateLeft,
  FaCheck,
  FaCircleExclamation,
  FaGripVertical,
} from "react-icons/fa6";

import { getErrorText } from "@/lib/api";
import taskService from "@/features/task/services/taskService";
import TaskPopup from "./taskPopup";
import type { Task } from "@/features/task/types/task";
import styles from "./taskItem.module.css";

interface TaskItemProps {
  task: Task;
  sortableRef?: (element: HTMLElement | null) => void;
  handleRef?: (element: HTMLElement | null) => void;
}

export default function TaskItem({
  task,
  sortableRef,
  handleRef,
}: TaskItemProps) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startTransition] = useTransition();
  const [completing, setCompleting] = useState(false);

  async function handleToggle() {
    if (completing) return;

    setCompleting(true);
    setError(null);

    try {
      await taskService.updateTask(task.id, { concluida: !task.concluida });
      startTransition(() => router.refresh());
    } catch (err) {
      setError(getErrorText(err));
    } finally {
      setCompleting(false);
    }
  }

  const completeLabel = task.concluida ? "Reabrir tarefa" : "Concluir tarefa";

  return (
    <li
      ref={sortableRef}
      className={styles.item}
      data-done={task.concluida ? "" : undefined}
    >
      <TaskPopup task={task} />

      {!task.concluida && (
        <button
          type="button"
          className={styles.handle}
          aria-label="Reordenar tarefa"
          title="Arraste para reordenar"
          ref={handleRef}
        >
          <FaGripVertical aria-hidden="true" />
        </button>
      )}

      <div className={styles.content}>
        <div className={styles.main}>
          <span className={styles.nome}>{task.nome}</span>

          <button
            type="button"
            className={styles.complete}
            aria-label={completeLabel}
            title={completeLabel}
            onClick={handleToggle}
            disabled={completing || isRefreshing}
          >
            {task.concluida ? (
              <FaArrowRotateLeft aria-hidden="true" />
            ) : (
              <FaCheck aria-hidden="true" />
            )}
          </button>
        </div>

        {error && (
          <p role="alert" className={styles.error}>
            <FaCircleExclamation aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    </li>
  );
}
