import Settings from "@/features/sidebar/components/settings";
import type { Profile } from "@/features/sidebar/types/profile";

import { FaGear, FaXmark } from "react-icons/fa6";
import { getTheme } from "./utils/getTheme";
import styles from "./sidebarPage.module.css";
import ThemePicker from "./components/themePicker";

interface SidebarPageProps {
  user: Profile;
}

export default async function SidebarPage({ user }: SidebarPageProps) {
  const theme = await getTheme();

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        popoverTarget="settings-sidebar"
        aria-label="Abrir configurações"
        title="Configurações"
      >
        <FaGear size={18} aria-hidden="true" />
      </button>

      <aside
        id="settings-sidebar"
        popover="auto"
        className={styles.sidebar}
        aria-label="Configurações"
      >
        <button
          type="button"
          className={styles.close}
          popoverTarget="settings-sidebar"
          popoverTargetAction="hide"
          aria-label="Fechar configurações"
        >
          <FaXmark size={18} aria-hidden="true" />
        </button>

        <ThemePicker theme={theme} />

        <hr className={styles.divider} />

        <Settings user={user} />
      </aside>
    </>
  );
}
