import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import styles from "./formFields.module.css";

export function Field({
  id,
  label,
  error,
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} role="alert" className={styles.fieldError}>
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField({
  id,
  name = "senha",
  autoComplete,
  minLength,
  hint,
  error,
  aside,
  onChange,
}: {
  id: string;
  name?: string;
  autoComplete: string;
  minLength?: number;
  hint?: string;
  error?: string;
  aside?: ReactNode;
  onChange?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          Senha
        </label>
        {aside}
      </div>
      <div className={styles.passwordWrap}>
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          className={`${styles.input} ${styles.passwordInput}`}
          autoComplete={autoComplete}
          minLength={minLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          onChange={onChange}
          required
        />
        <button
          type="button"
          className={styles.toggle}
          aria-controls={id}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className={styles.fieldError}>
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function SubmitButton({
  submitting,
  label,
  busyLabel,
}: {
  submitting: boolean;
  label: string;
  busyLabel: string;
}) {
  return (
    <button
      type="submit"
      className={styles.submit}
      disabled={submitting}
      aria-busy={submitting}
    >
      {submitting && <span className={styles.spinner} aria-hidden="true" />}
      {submitting ? busyLabel : label}
    </button>
  );
}
