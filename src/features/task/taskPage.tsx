import TaskCompose from "./components/taskCompose";
import TaskList from "./components/taskList";
import { getCurrentUser } from "../auth/services/getCurrentUser";
import type { Task } from "./types/task";

import styles from "./taskPage.module.css";
import SidebarPage from "../sidebar/sidebarPage";

interface TaskPageProps {
  tasks: Task[];
}

export default async function TaskPage({ tasks }: TaskPageProps) {
  const user = await getCurrentUser();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <SidebarPage user={user} />
      </header>

      <main className={styles.page}>
        <TaskCompose />
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
}
