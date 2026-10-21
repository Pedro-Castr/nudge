"use client";

import Settings from "@/features/sidebar/components/settings";
import type { Profile } from "@/features/sidebar/types/profile";

import { FaGear, FaXmark } from "react-icons/fa6";
import styles from "./sidebarPage.module.css";

const SIDEBAR_ID = "settings-sidebar";

interface SidebarPageProps {
  user: Profile;
}

export default function SidebarPage({ user }: SidebarPageProps) {
  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        popoverTarget={SIDEBAR_ID}
        aria-label="Abrir configurações"
        title="Configurações"
      >
        <FaGear size={18} aria-hidden="true" />
      </button>

      <aside
        id={SIDEBAR_ID}
        popover="auto"
        className={styles.sidebar}
        aria-label="Configurações"
      >
        <button
          type="button"
          className={styles.close}
          popoverTarget={SIDEBAR_ID}
          popoverTargetAction="hide"
          aria-label="Fechar configurações"
        >
          <FaXmark size={18} aria-hidden="true" />
        </button>

        <Settings user={user} />
      </aside>
    </>
  );
}
