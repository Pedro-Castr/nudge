"use client";

import { useRef, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";

import { getErrorText } from "@/lib/api";
import taskService from "@/features/task/services/taskService";
import styles from "./taskCompose.module.css";

export default function TaskCompose() {
  const router = useRouter();
  const nomeRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await taskService.createTask({
        nome,
        descricao: descricao.trim() || undefined,
      });

      setNome("");
      setDescricao("");
      nomeRef.current?.focus();
      router.refresh();
    } catch (err) {
      setError(getErrorText(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <div className={styles.pill}>
        <span className={styles.dot} aria-hidden="true" />

        <label className={styles.field}>
          <span className={styles.srOnly}>Nome da tarefa</span>
          <input
            ref={nomeRef}
            className={styles.input}
            type="text"
            name="nome"
            placeholder="Anotar nova tarefa..."
            maxLength={100}
            autoComplete="off"
            required
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setError(null);
            }}
          />
        </label>

        <button
          type="submit"
          className={styles.submit}
          aria-label="Adicionar tarefa"
          title="Adicionar tarefa"
          disabled={submitting}
        >
          <FaPlus />
        </button>
      </div>

      <div className={styles.details}>
        <div className={styles.detailsInner}>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}

          <label className={styles.detailsField}>
            <span className={styles.srOnly}>Detalhes (opcional)</span>
            <textarea
              className={styles.textarea}
              name="descricao"
              placeholder="Detalhes (opcional)"
              maxLength={256}
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </label>
        </div>
      </div>
    </form>
  );
}
