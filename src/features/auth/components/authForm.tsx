"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { type Mode, type AuthValues } from "@/features/auth/types/auth";

import styles from "./authForm.module.css";

type Phase = "idle" | "out" | "in";
type Direction = "forward" | "back";

const TRANSITION_MS = 150;

const PANEL_CLASS: Record<Exclude<Phase, "idle">, Record<Direction, string>> = {
  out: { forward: styles.outForward, back: styles.outBack },
  in: { forward: styles.inForward, back: styles.inBack },
};

interface AuthFormProps {
  onSubmit?: (mode: Mode, values: AuthValues) => void | Promise<void>;
}

export default function AuthForm({ onSubmit }: AuthFormProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  const uid = useId();
  const [mode, setMode] = useState<Mode>("login");
  const [view, setView] = useState<Mode>("login");
  const [phase, setPhase] = useState<Phase>("idle");
  const [direction, setDirection] = useState<Direction>("forward");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState<AuthValues>({
    nome: "",
    email: "",
    senha: "",
  });
  const timers = useRef<number[]>([]);
  const isLogin = view === "login";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  function changeMode(next: Mode) {
    if (next === mode || phase !== "idle") return;

    setMode(next);
    setDirection(next === "signup" ? "forward" : "back");
    setPhase("out");
    setError(null);

    const swap = window.setTimeout(() => {
      setView(next);
      setPhase("in");

      const done = window.setTimeout(() => setPhase("idle"), TRANSITION_MS);
      timers.current.push(done);
    }, TRANSITION_MS);
    timers.current.push(swap);
  }

  function setField<K extends keyof AuthValues>(key: K, value: AuthValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit?.(view, values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado");
    } finally {
      setSubmitting(false);
    }
  }

  const panelClass = phase === "idle" ? "" : PANEL_CLASS[phase][direction];

  return (
    <section className={styles.formSide}>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={styles.tabsBtn}
            aria-pressed={mode === "login"}
            onClick={() => changeMode("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            className={styles.tabsBtn}
            aria-pressed={mode === "signup"}
            onClick={() => changeMode("signup")}
          >
            Criar conta
          </button>
        </div>

        <div
          className={`${styles.panelWrap} ${phase !== "idle" ? styles.animating : ""}`}
          style={height === undefined ? undefined : { height }}
        >
          <div ref={panelRef} className={`${styles.panel} ${panelClass}`}>
            <header className={styles.cardHead}>
              <h2>{isLogin ? "Que bom te ver de novo" : "Crie sua conta"}</h2>
              <p>
                {isLogin
                  ? "Entre para ver o que está esperando por você."
                  : "Leva menos de um minuto. Depois é só anotar."}
              </p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
              {!isLogin && (
                <div className={styles.field}>
                  <label htmlFor={`${uid}-nome`}>Nome</label>
                  <input
                    id={`${uid}-nome`}
                    type="text"
                    autoComplete="name"
                    placeholder="Como devemos te chamar?"
                    required
                    value={values.nome}
                    onChange={(e) => setField("nome", e.target.value)}
                  />
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor={`${uid}-email`}>E-mail</label>
                <input
                  id={`${uid}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  required
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <div className={styles.fieldRow}>
                  <label htmlFor={`${uid}-senha`}>Senha</label>
                  {isLogin && (
                    <a className={styles.fieldLink} href="/recuperar-senha">
                      Esqueci minha senha
                    </a>
                  )}
                </div>
                <div className={styles.fieldPassword}>
                  <input
                    id={`${uid}-senha`}
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder="Sua senha"
                    required
                    minLength={isLogin ? undefined : 8}
                    value={values.senha}
                    onChange={(e) => setField("senha", e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.fieldToggle}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {!isLogin && (
                  <span className={styles.fieldHint}>
                    Use pelo menos 8 caracteres.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.submit}
                disabled={submitting}
              >
                {isLogin ? "Entrar" : "Criar conta"}
              </button>

              {!isLogin && (
                <p className={styles.terms}>
                  Ao criar a conta, você concorda com os Termos de uso e a
                  Política de privacidade.
                </p>
              )}
            </form>

            <p className={styles.switchRow}>
              <span>{isLogin ? "Ainda não tem conta?" : "Já tem conta?"}</span>
              <button
                type="button"
                onClick={() => changeMode(isLogin ? "signup" : "login")}
              >
                {isLogin ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
