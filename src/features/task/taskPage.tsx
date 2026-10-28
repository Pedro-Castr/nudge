import { cookies } from "next/headers";

import SidebarPage from "../sidebar/sidebarPage";
import TaskCompose from "./components/taskCompose";
import TaskList from "./components/taskList";
import Background from "@/components/background";

import {
  THEMES,
  BACKGROUNDS,
  ThemeId,
  BackgroundId,
  isBackgroundId,
} from "@/features/sidebar/types/theme";
import type { Task } from "./types/task";
import type { Profile } from "../sidebar/types/profile";

import { FaGear } from "react-icons/fa6";
import styles from "./taskPage.module.css";

interface TaskPageProps {
  tasks: Task[];
  user: Profile;
}

export default async function TaskPage({ tasks, user }: TaskPageProps) {
  const savedColor = (await cookies()).get("nudge-theme")?.value;
  const color = THEMES.includes(savedColor as ThemeId) ? savedColor : "azul";

  const savedBackground = (await cookies()).get("nudge-background")?.value;
  const background = isBackgroundId(savedBackground)
    ? savedBackground
    : "symbol";

  return (
    <div data-color={color} data-theme-root className={styles.page}>
      <Background variants={background} />

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
