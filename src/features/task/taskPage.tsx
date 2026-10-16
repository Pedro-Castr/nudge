import TaskCompose from "./components/taskCompose";
import TaskList from "./components/taskList";
import type { Task } from "./types/task";

import styles from "./taskPage.module.css";

interface TaskPageProps {
  tasks: Task[];
}

export default function TaskPage({ tasks }: TaskPageProps) {
  return (
    <main className={styles.page}>
      <TaskCompose />
      <TaskList tasks={tasks} />
    </main>
  );
}
