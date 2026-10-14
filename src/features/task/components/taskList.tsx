import TaskItem from "./taskItem";
import type { Task } from "@/features/task/types/task";

import styles from "./taskList.module.css";

interface TaskListProps {
  /** Já na ordem da posição, como a API devolve. */
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const pending = tasks.filter((task) => !task.concluida);
  const done = tasks.filter((task) => task.concluida);

  if (tasks.length === 0) {
    return (
      <p className={styles.empty}>
        Nada por aqui. Anote a primeira e dê o primeiro empurrãozinho.
      </p>
    );
  }

  const pendingCount =
    pending.length === 1 ? "1 pendente" : `${pending.length} pendentes`;
  const doneCount =
    done.length === 1 ? "1 concluída" : `${done.length} concluídas`;

  return (
    <div className={styles.list}>
      <div className={styles.section}>
        {pending.length > 0 && (
          <>
            <ol className={styles.items}>
              {pending.map((task) => (
                <TaskItem key={task.id} task={task} />
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
  );
}
