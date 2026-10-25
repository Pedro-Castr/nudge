"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { getErrorText } from "@/lib/api";
import styles from "./authForm.module.css";

type Mode = "login" | "signup";
type Values = { nome: string; email: string; senha: string };
type FieldErrors = Partial<Record<keyof Values, string>>;

type AuthFormProps = {
  onSubmit?: (mode: Mode, values: Values) => void | Promise<void>;
};

const TABS: { mode: Mode; label: string }[] = [
  { mode: "login", label: "Entrar" },
  { mode: "signup", label: "Criar conta" },
];

function Field({
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

function PasswordField({
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
          {visible ? "Ocultar" : "Mostrar"}
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

function SubmitButton({
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

export default function AuthForm({ onSubmit }: AuthFormProps) {
  const uid = useId();
  const [mode, setMode] = useState<Mode>("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FieldErrors>({});
  const [height, setHeight] = useState<number>();
  const loginRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);

  // Altura animada: mede o painel ativo
  useEffect(() => {
    const el = mode === "login" ? loginRef.current : signupRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  const tabId = (m: Mode) => `${uid}-tab-${m}`;
  const panelId = (m: Mode) => `${uid}-panel-${m}`;

  // limpa o erro de um campo quando a pessoa volta a digitar
  const clear = (field: keyof Values) =>
    setError((e) => ({ ...e, [field]: undefined }));

  function changeMode(next: Mode) {
    setMode(next);
    setError({});
  }

  function handleTabKey(e: KeyboardEvent<HTMLDivElement>) {
    let next: Mode | null = null;
    if (e.key === "ArrowRight" || e.key === "End") next = "signup";
    if (e.key === "ArrowLeft" || e.key === "Home") next = "login";
    if (!next) return;
    e.preventDefault();
    changeMode(next);
    document.getElementById(tabId(next))?.focus();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>, formMode: Mode) {
    e.preventDefault();
    if (submitting) return;
    const data = new FormData(e.currentTarget);
    const values: Values = {
      nome: String(data.get("nome") ?? ""),
      email: String(data.get("email") ?? ""),
      senha: String(data.get("senha") ?? ""),
    };
    setSubmitting(true);
    setError({});
    try {
      if (onSubmit) await onSubmit(formMode, values);
      else await new Promise((r) => setTimeout(r, 1200)); // só para ver o estado; remova
    } catch (err) {
      // getErrorText devolve um texto só; escolhi onde mostrá-lo:
      // login: sob a senha; cadastro: sob o e-mail (ex.: "e-mail já cadastrado")
      const field = formMode === "login" ? "senha" : "email";
      setError({ [field]: getErrorText(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.root} data-mode={mode}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Acesso ao Nudge"
        onKeyDown={handleTabKey}
      >
        <span className={styles.indicator} aria-hidden="true" />
        {TABS.map((t) => (
          <button
            key={t.mode}
            id={tabId(t.mode)}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={mode === t.mode}
            aria-controls={panelId(t.mode)}
            tabIndex={mode === t.mode ? 0 : -1}
            disabled={submitting}
            onClick={() => changeMode(t.mode)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className={styles.viewport}
        style={height ? { height: height + 8 } : undefined}
      >
        <div className={styles.track}>
          <div
            ref={loginRef}
            id={panelId("login")}
            role="tabpanel"
            aria-labelledby={tabId("login")}
            className={styles.panel}
            aria-hidden={mode !== "login"}
            inert={mode !== "login"}
          >
            <form
              className={styles.form}
              onSubmit={(e) => handleSubmit(e, "login")}
            >
              <h2 className={styles.title}>Que bom te ver de novo</h2>
              <Field
                id={`${uid}-login-email`}
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
                error={error.email}
                onChange={() => clear("email")}
                required
              />
              <PasswordField
                id={`${uid}-login-senha`}
                autoComplete="current-password"
                error={error.senha}
                onChange={() => clear("senha")}
                aside={
                  <Link href="/esqueci-senha" className={styles.forgot}>
                    Esqueci minha senha
                  </Link>
                }
              />
              <SubmitButton
                submitting={submitting && mode === "login"}
                label="Entrar"
                busyLabel="Entrando…"
              />
            </form>
          </div>

          <div
            ref={signupRef}
            id={panelId("signup")}
            role="tabpanel"
            aria-labelledby={tabId("signup")}
            className={styles.panel}
            aria-hidden={mode !== "signup"}
            inert={mode !== "signup"}
          >
            <form
              className={styles.form}
              onSubmit={(e) => handleSubmit(e, "signup")}
            >
              <h2 className={styles.title}>Crie sua conta</h2>
              <Field
                id={`${uid}-signup-nome`}
                label="Nome"
                name="nome"
                type="text"
                autoComplete="name"
                error={error.nome}
                onChange={() => clear("nome")}
                required
              />
              <Field
                id={`${uid}-signup-email`}
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
                error={error.email}
                onChange={() => clear("email")}
                required
              />
              <PasswordField
                id={`${uid}-signup-senha`}
                autoComplete="new-password"
                minLength={8}
                hint="Use pelo menos 8 caracteres"
                error={error.senha}
                onChange={() => clear("senha")}
              />
              <SubmitButton
                submitting={submitting && mode === "signup"}
                label="Criar conta"
                busyLabel="Criando conta…"
              />
              <p className={styles.legal}>
                Ao criar sua conta, você concorda com os{" "}
                <Link href="/termos">Termos de uso</Link> e a{" "}
                <Link href="/privacidade">Política de privacidade</Link>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
