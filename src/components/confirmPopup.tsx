"use client";

import { useRef, useState, type ReactNode } from "react";
import { FaCircleQuestion, FaTriangleExclamation } from "react-icons/fa6";

import { getErrorText } from "@/lib/api";
import styles from "./confirmPopup.module.css";

interface ConfirmPopupProps {
  id: string;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  icon?: ReactNode;
  onConfirm: () => void | Promise<void>;
}

export default function ConfirmPopup({
  id,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "default",
  icon,
  onConfirm,
}: ConfirmPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const danger = tone === "danger";

  function closePopup() {
    const popup = popupRef.current;

    if (popup?.matches(":popover-open")) {
      popup.hidePopover();
    }
  }

  async function handleConfirm() {
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      await onConfirm();
      closePopup();
    } catch (err) {
      setError(getErrorText(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      id={id}
      ref={popupRef}
      popover="auto"
      role="alertdialog"
      className={styles.popup}
      onToggle={(event) => {
        if (event.newState === "closed") setError(null);
      }}
    >
      <span
        className={`${styles.icon} ${danger ? styles.iconDanger : ""}`}
        aria-hidden="true"
      >
        {icon ?? (danger ? <FaTriangleExclamation /> : <FaCircleQuestion />)}
      </span>

      <h3 className={styles.title}>{title}</h3>

      {description && <p className={styles.description}>{description}</p>}

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.button} ${styles.cancel}`}
          popoverTarget={id}
          popoverTargetAction="hide"
          disabled={pending}
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          className={`${styles.button} ${danger ? styles.danger : styles.primary}`}
          onClick={handleConfirm}
          disabled={pending}
          aria-busy={pending}
        >
          {pending && <span className={styles.spinner} aria-hidden="true" />}
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
