"use client";

import { useRef, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";

import { getErrorText } from "@/lib/api";
import SettingsService from "../services/settingsService";
import { getChanges } from "@/features/sidebar/utils/getChanges";
import type { Profile } from "@/features/sidebar/types/profile";

import styles from "./editProfilePopup.module.css";

interface EditProfilePopupProps {
  id: string;
  user: Profile;
}

export default function EditProfilePopup({ id, user }: EditProfilePopupProps) {
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const titleId = `${id}-title`;

  async function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const changes = getChanges(user, {
      nome: String(data.get("nome")).trim(),
      email: String(data.get("email")).trim(),
      senha: String(data.get("senha")).trim() || user.senha, // em branco: mantém a atual
    });

    if (Object.keys(changes).length === 0) return;

    setSaving(true);
    setError(null);

    try {
      await SettingsService.updateUser(user.id, changes);
      popupRef.current?.hidePopover();
      router.refresh();
    } catch (err) {
      setError(getErrorText(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      id={id}
      ref={popupRef}
      popover="auto"
      role="dialog"
      aria-labelledby={titleId}
      className={styles.popup}
    >
      <h3 id={titleId} className={styles.title}>
        Editar perfil
      </h3>

      <form
        className={styles.form}
        onSubmit={handleSave}
        onChange={() => setError(null)}
      >
        <label className={styles.field}>
          Nome
          <input
            className={styles.input}
            type="text"
            name="nome"
            autoComplete="name"
            defaultValue={user.nome}
            required
          />
        </label>

        <label className={styles.field}>
          E-mail
          <input
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            defaultValue={user.email}
            required
          />
        </label>

        <label className={styles.field}>
          Nova senha (opcional)
          <input
            className={styles.input}
            type="password"
            name="senha"
            autoComplete="new-password"
            minLength={8}
          />
          <span className={styles.hint}>
            Deixe em branco para manter a atual. Mínimo de 8 caracteres.
          </span>
        </label>

        {error && (
          <p role="alert" className={styles.popupError}>
            {error}
          </p>
        )}

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.button}
            popoverTarget={id}
            popoverTargetAction="hide"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
            disabled={saving}
          >
            Salvar
          </button>
        </div>
      </form>

      <button
        type="button"
        className={styles.close}
        popoverTarget={id}
        popoverTargetAction="hide"
        aria-label="Fechar"
      >
        <FaXmark size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
