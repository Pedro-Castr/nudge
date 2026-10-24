import { FaGear } from "react-icons/fa6";
import SidebarPage from "../sidebar/sidebarPage";
import TaskCompose from "./components/taskCompose";
import TaskList from "./components/taskList";
import type { Task } from "./types/task";
import type { Profile } from "../sidebar/types/profile";
import styles from "./taskPage.module.css";

interface TaskPageProps {
  tasks: Task[];
  user: Profile;
}

export default function TaskPage({ tasks, user }: TaskPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.settingsButton}
          popoverTarget="settings-sidebar"
          aria-label="Abrir configurações"
        >
          <FaGear aria-hidden="true" />
        </button>
      </header>

      <main className={styles.main}>
        <TaskCompose />
        <TaskList tasks={tasks} />
      </main>

      <SidebarPage user={user} />
    </div>
  );
}
