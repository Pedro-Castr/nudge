import { cookies } from "next/headers";

import SidebarPage from "../sidebar/sidebarPage";
import TaskCompose from "./components/taskCompose";
import TaskList from "./components/taskList";
import Background from "@/components/background";

import { THEMES, ThemeId } from "@/features/sidebar/types/theme";
import type { Task } from "./types/task";
import type { Profile } from "../sidebar/types/profile";

import { FaGear } from "react-icons/fa6";
import styles from "./taskPage.module.css";

interface TaskPageProps {
  tasks: Task[];
  user: Profile;
}

export default async function TaskPage({ tasks, user }: TaskPageProps) {
  const saved = (await cookies()).get("nudge-theme")?.value;
  const color = THEMES.includes(saved as ThemeId) ? saved : "azul";

  return (
    <div data-color={color} data-theme-root className={styles.page}>
      <Background />

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
