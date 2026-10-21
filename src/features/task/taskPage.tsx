import TaskCompose from "./components/taskCompose";
import TaskList from "./components/taskList";
import { Profile } from "../sidebar/types/profile";
import type { Task } from "./types/task";

import styles from "./taskPage.module.css";
import SidebarPage from "../sidebar/sidebarPage";

interface TaskPageProps {
  tasks: Task[];
  user: Profile;
}

export default function TaskPage({ tasks, user }: TaskPageProps) {
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
