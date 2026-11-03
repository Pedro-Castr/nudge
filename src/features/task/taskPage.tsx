import { cookies } from "next/headers";

import SidebarPage from "../sidebar/sidebarPage";
import TaskGreeting from "./components/taskGreeting";
import TaskCompose from "./components/taskCompose";
import TaskList from "./components/taskList";
import Background from "@/components/background";

import {
  THEMES,
  ThemeId,
  isBackgroundId,
} from "@/features/sidebar/types/theme";
import { tasksMokup } from "./utils/random";
import { pickRandom } from "./utils/random";
import { pickGreeting } from "./utils/greetings";
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
        <TaskGreeting parts={pickGreeting(user.nome)} />
        <TaskCompose placeholder={pickRandom(tasksMokup)} />
        <TaskList tasks={tasks} />
      </main>

      <SidebarPage user={user} />
    </div>
  );
}
