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

  const pendingTasks = tasks.filter((task) => !task.concluida);

  const pending = [
    ...orderedIds
      .map((id) => pendingTasks.find((task) => task.id === id))
      .filter((task): task is Task => task !== undefined),

    ...pendingTasks.filter((task) => !orderedIds.includes(task.id)),
  ];

  const done = tasks.filter((task) => task.concluida);

  const pendingCount =
    pending.length === 1 ? "1 pendente" : `${pending.length} pendentes`;

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
          <span className={styles.emptyMark} aria-hidden="true">
            <Logo size={32} showWordmark={false} />
          </span>
          <p className={styles.emptyText}>
            Nada por aqui. Anote sua primeira tarefa.
          </p>
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

              <p className={styles.count}>{pendingCount}</p>
            </section>
          )}

          {done.length > 0 && (
            <details className={styles.done}>
              <summary className={styles.summary}>
                <span className={styles.summaryLabel}>Concluídas</span>
                <span className={styles.badge}>{done.length}</span>
                <FaChevronDown className={styles.chevron} aria-hidden="true" />
              </summary>

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
