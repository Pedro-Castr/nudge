"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import SettingsService from "../services/settingsService";
import type { Profile } from "@/features/sidebar/types/profile";
import EditProfilePopup from "./editProfilePopup";

import { FaRightFromBracket, FaTrashCan, FaUserPen } from "react-icons/fa6";
import styles from "./settings.module.css";

const EDIT_PROFILE_ID = "edit-profile-popup";

interface SettingsProps {
  user: Profile;
}

export default function Settings({ user }: SettingsProps) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);

    try {
      await SettingsService.deleteUser(user.id);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    }
  }

  async function handleLogOut() {
    try {
      await SettingsService.logOutUser();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    }
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
            popoverTarget={EDIT_PROFILE_ID}
          >
            <FaUserPen size={18} aria-hidden="true" />
            Editar perfil
          </button>

          <button
            type="button"
            className={styles.action}
            onClick={handleLogOut}
          >
            <FaRightFromBracket size={18} aria-hidden="true" />
            Sair
          </button>

          <button
            type="button"
            className={`${styles.action} ${styles.actionDanger}`}
            onClick={handleDelete}
          >
            <FaTrashCan size={18} aria-hidden="true" />
            Excluir conta
          </button>
        </div>

        {error && (
          <p role="alert" className={styles.popupError}>
            {error}
          </p>
        )}
      </div>

      <EditProfilePopup id={EDIT_PROFILE_ID} user={user} />
    </>
  );
}
