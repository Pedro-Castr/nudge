import TaskCompose from "./components/taskCompose";
import TaskList from "./components/taskList";
import SettingsSidebar from "../sidebar/components/settings";
import { getCurrentUser } from "../auth/services/getCurrentUser";
import type { Task } from "./types/task";

import styles from "./taskPage.module.css";

interface TaskPageProps {
  tasks: Task[];
}

export default async function TaskPage({ tasks }: TaskPageProps) {
  const user = await getCurrentUser();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <SettingsSidebar user={user} />
      </header>

      <main className={styles.page}>
        <TaskCompose />
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
}
