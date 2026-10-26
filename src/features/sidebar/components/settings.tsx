"use client";

import { useRouter } from "next/navigation";

import SettingsService from "../services/settingsService";
import ConfirmPopup from "@/components/confirmPopup";
import type { Profile } from "@/features/sidebar/types/profile";
import EditProfilePopup from "./editProfilePopup";

import { FaRightFromBracket, FaTrashCan, FaUserPen } from "react-icons/fa6";
import styles from "./settings.module.css";

interface SettingsProps {
  user: Profile;
}

export default function Settings({ user }: SettingsProps) {
  const router = useRouter();

  async function handleDelete() {
    await SettingsService.deleteUser(user.id);
    await SettingsService.logOutUser().catch(() => {});
    router.replace("/");
  }

  async function handleLogOut() {
    await SettingsService.logOutUser();
    router.replace("/");
  }

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.title}>Configurações</h2>
      </header>

      <div className={styles.body}>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.action}
            popoverTarget="edit-profile-popup"
          >
            <FaUserPen size={18} aria-hidden="true" />
            Editar perfil
          </button>

          <button
            type="button"
            className={styles.action}
            popoverTarget="confirm-logout"
          >
            <FaRightFromBracket size={18} aria-hidden="true" />
            Sair
          </button>

          <button
            type="button"
            className={`${styles.action} ${styles.actionDanger}`}
            popoverTarget="confirm-delete"
          >
            <FaTrashCan size={18} aria-hidden="true" />
            Excluir conta
          </button>
        </div>
      </div>

      <EditProfilePopup id="edit-profile-popup" user={user} />

      <ConfirmPopup
        id="confirm-logout"
        title="Sair da conta?"
        description="Você vai precisar entrar de novo para ver suas tarefas."
        confirmLabel="Sair"
        onConfirm={handleLogOut}
      />

      <ConfirmPopup
        id="confirm-delete"
        tone="danger"
        title="Excluir sua conta?"
        description="Suas tarefas e seus dados serão apagados para sempre. Essa ação não pode ser desfeita."
        confirmLabel="Excluir conta"
        onConfirm={handleDelete}
      />
    </>
  );
}
