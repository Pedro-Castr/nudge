"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaArrowRotateLeft } from "react-icons/fa6";
import { LuGrip } from "react-icons/lu";

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

  const [Error, setError] = useState<string | null>(null);
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
      className={`${styles.item} ${task.concluida ? styles.itemDone : ""}`}
    >
      <TaskPopup task={task} />

      {!task.concluida && (
        <button
          type="button"
          className={styles.handleArea}
          aria-label="Reordenar tarefa"
          title="Arraste para reordenar"
          ref={handleRef}
        >
          <LuGrip />
        </button>
      )}

      <div className={styles.text}>
        <span className={styles.nome}>{task.nome}</span>
        {Error && (
          <span role="alert" className={styles.cardError}>
            {Error}
          </span>
        )}
      </div>

      <button
        type="button"
        className={styles.complete}
        aria-label={completeLabel}
        title={completeLabel}
        onClick={handleToggle}
        disabled={completing || isRefreshing}
      >
        {(!task.concluida && <FaCheck />) || <FaArrowRotateLeft />}
      </button>
    </li>
  );
}
