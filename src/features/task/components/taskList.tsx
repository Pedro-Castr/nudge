"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { FaChevronDown, FaCircleExclamation } from "react-icons/fa6";

import Logo from "@/components/logo";
import { getErrorText } from "@/lib/api";
import taskService from "../services/taskService";
import type { Task } from "@/features/task/types/task";
import TaskItem from "./taskItem";
import styles from "./taskList.module.css";

interface TaskListProps {
  tasks: Task[];
}

interface SortableTaskProps {
  task: Task;
  index: number;
  disabled: boolean;
}

function SortableTask({ task, index, disabled }: SortableTaskProps) {
  const { ref, handleRef } = useSortable({
    id: task.id,
    index,
    disabled,
  });

  return <TaskItem task={task} sortableRef={ref} handleRef={handleRef} />;
}

export default function TaskList({ tasks }: TaskListProps) {
  const router = useRouter();
  const [orderedIds, setOrderedIds] = useState<Task["id"][]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pendingTasks = tasks.filter((task) => !task.completed_at);

  const pending = [
    ...orderedIds
      .map((id) => pendingTasks.find((task) => task.id === id))
      .filter((task): task is Task => task !== undefined),

    ...pendingTasks.filter((task) => !orderedIds.includes(task.id)),
  ];

  const done = tasks.filter((task) => task.completed_at);

  return (
    <DragDropProvider
      onDragEnd={async (event) => {
        if (event.canceled) return;

        const source = event.operation.source;

        if (!isSortable(source)) return;

        const { initialIndex, index } = source;

        if (initialIndex === index) return;

        const ids = pending.map((task) => task.id);
        const [movedId] = ids.splice(initialIndex, 1);

        if (movedId === undefined) return;

        ids.splice(index, 0, movedId);

        const previousIds = orderedIds;

        setOrderedIds(ids);
        setSaving(true);
        setError(null);

        try {
          await taskService.reorderTasks(ids);
        } catch (err) {
          setOrderedIds(previousIds);
          setError(getErrorText(err));
          router.refresh();
        } finally {
          setSaving(false);
        }
      }}
    >
      {tasks.length === 0 ? (
        <div className={styles.empty}>
          <svg
            className={styles.mark}
            viewBox="5 8 32 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle className={styles.dot} cx="12" cy="20" r="5" />
            <circle className={styles.ring} cx="25" cy="20" r="10" />
          </svg>

          <div className={styles.copy}>
            <h2 className={styles.title}>Nada por aqui.</h2>
            <p className={styles.text}>Anote sua primeira tarefa.</p>
          </div>
        </div>
      ) : (
        <div className={styles.root}>
          {error && (
            <p role="alert" className={styles.error}>
              <FaCircleExclamation aria-hidden="true" />
              {error}
            </p>
          )}

          {pending.length > 0 && (
            <section className={styles.pending} aria-label="Pendentes">
              <ol className={styles.items} aria-busy={saving}>
                {pending.map((task, index) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    index={index}
                    disabled={saving}
                  />
                ))}
              </ol>
            </section>
          )}

          {done.length > 0 && (
            <details className={styles.done}>
              <summary className={styles.summary}>
                <span className={styles.summaryLabel}>Concluídas</span>
                <FaChevronDown className={styles.chevron} aria-hidden="true" />
              </summary>

              <p className={styles.doneText}>
                Suas tarefas concluídas serão excluídas automaticamente após 10
                dias.
              </p>
              <ul className={`${styles.items} ${styles.doneBody}`}>
                {done.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </DragDropProvider>
  );
}
