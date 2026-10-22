"use client";

import { useState, useRef, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";

import { getErrorText } from "@/lib/api";
import SettingsService from "../services/settingsService";
import { getChanges } from "@/features/sidebar/utils/getChanges";
import type { Profile } from "@/features/sidebar/types/profile";

import { FaXmark } from "react-icons/fa6";
import styles from "./editProfilePopup.module.css";

interface EditProfilePopupProps {
  id: string;
  user: Profile;
}

export default function EditProfilePopup({ id, user }: EditProfilePopupProps) {
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);

  const titleId = `${id}-title`;

  const [nome, setNome] = useState(user.nome);
  const [email, setEmail] = useState(user.email);
  const [senha, setSenha] = useState(user.senha);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function closePopup() {
    const popup = popupRef.current;

    if (popup?.matches(":popover-open")) {
      popup.hidePopover();
    }
  }

  async function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const changes = getChanges(user, {
      nome: nome.trim(),
      email: email.trim(),
      senha: senha?.trim(),
    });

    if (Object.keys(changes).length === 0) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await SettingsService.updateUser(user.id, changes);
      closePopup();
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

      <form className={styles.form} onSubmit={handleSave}>
        <label className={styles.field}>
          Nome
          <input
            className={styles.input}
            type="text"
            name="nome"
            autoComplete="name"
            defaultValue={user?.nome}
            required
            onChange={(e) => {
              setNome(e.target.value);
              setError(null);
            }}
          />
        </label>

        <label className={styles.field}>
          E-mail
          <input
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            defaultValue={user?.email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
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
            onChange={(e) => {
              setSenha(e.target.value);
              setError(null);
            }}
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
