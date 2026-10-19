"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";

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
          setError(err instanceof Error ? err.message : "Algo deu errado.");
          router.refresh();
        } finally {
          setSaving(false);
        }
      }}
    >
      {tasks.length === 0 ? (
        <p className={styles.empty}>
          Nada por aqui. Anote sua primeira tarefa.
        </p>
      ) : (
        <div className={styles.list}>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}

          <div className={styles.section}>
            {pending.length > 0 && (
              <>
                <ol className={styles.items}>
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
              </>
            )}
          </div>

          {done.length > 0 && (
            <div className={styles.section}>
              <details className={styles.done}>
                <summary className={`${styles.label} ${styles.summary}`}>
                  <span className={styles.labelText}>
                    Concluídas
                    <span className={styles.chevron} aria-hidden="true" />
                  </span>
                </summary>

                <ul className={styles.items}>
                  {done.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </ul>
              </details>
            </div>
          )}
        </div>
      )}
    </DragDropProvider>
  );
}
