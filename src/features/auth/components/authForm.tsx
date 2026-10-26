"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type SubmitEvent } from "react";

import { PasswordField, Field, SubmitButton } from "./formFields";
import type { FormMode, AuthValues, FieldErrors } from "../types/auth";
import { getErrorText } from "@/lib/api";

import styles from "./authForm.module.css";

type AuthFormProps = {
  onSubmit?: (mode: FormMode, values: AuthValues) => void | Promise<void>;
};

const TABS: { mode: FormMode; label: string }[] = [
  { mode: "login", label: "Entrar" },
  { mode: "signup", label: "Criar conta" },
];

export default function AuthForm({ onSubmit }: AuthFormProps) {
  const [mode, setMode] = useState<FormMode>("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FieldErrors>({});
  const [height, setHeight] = useState<number>();
  const loginRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activePanel = mode === "login" ? loginRef.current : signupRef.current;
    if (!activePanel) return;

    const updateHeight = () => setHeight(activePanel.offsetHeight);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(activePanel);

    return () => resizeObserver.disconnect();
  }, [mode]);

  const clear = (field: keyof AuthValues) =>
    setError((e) => ({ ...e, [field]: undefined }));

  function changeMode(next: FormMode) {
    setMode(next);
    setError({});
  }

  async function handleSubmit(
    e: SubmitEvent<HTMLFormElement>,
    formMode: FormMode,
  ) {
    e.preventDefault();
    if (submitting) return;
    const data = new FormData(e.currentTarget);
    const values: AuthValues = {
      nome: String(data.get("nome") ?? ""),
      email: String(data.get("email") ?? ""),
      senha: String(data.get("senha") ?? ""),
    };
    setSubmitting(true);
    setError({});
    try {
      if (onSubmit) await onSubmit(formMode, values);
    } catch (err) {
      const field = formMode === "login" ? "senha" : "email";
      setError({ [field]: getErrorText(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.root} data-mode={mode}>
      <div className={styles.tabs} role="tablist" aria-label="Acesso ao Nudge">
        <span className={styles.indicator} aria-hidden="true" />
        {TABS.map((t) => (
          <button
            key={t.mode}
            id={`tab-${t.mode}`}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={mode === t.mode}
            aria-controls={`panel-${t.mode}`}
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
            id="login-panel"
            role="tabpanel"
            aria-labelledby="tab-login"
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
                id="login-email"
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
                error={error.email}
                onChange={() => clear("email")}
                required
              />
              <PasswordField
                id="login-senha"
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
            id="signup-panel"
            role="tabpanel"
            aria-labelledby="tab-signup"
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
                id="signup-nome"
                label="Nome"
                name="nome"
                type="text"
                autoComplete="name"
                error={error.nome}
                onChange={() => clear("nome")}
                required
              />
              <Field
                id="signup-email"
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
                error={error.email}
                onChange={() => clear("email")}
                required
              />
              <PasswordField
                id="signup-senha"
                autoComplete="new-password"
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
