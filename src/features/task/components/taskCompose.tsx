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
    <div className={styles.wrapper}>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <form className={styles.root} onSubmit={handleSubmit}>
        <label htmlFor="nova-tarefa-nome" className="visually-hidden">
          Nova tarefa
        </label>
        <input
          id="nova-tarefa-nome"
          name="nome"
          type="text"
          className={styles.input}
          placeholder="O que você quer lembrar?"
          autoComplete="off"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            setError(null);
          }}
        />
        <div className={styles.details}>
          <label htmlFor="nova-tarefa-detalhes" className={styles.detailsLabel}>
            Detalhes (opcional)
          </label>
          <textarea
            id="nova-tarefa-detalhes"
            name="descricao"
            className={styles.textarea}
            rows={3}
            placeholder="Algo que ajude você a lembrar depois"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={styles.add}
          aria-label="Adicionar tarefa"
          disabled={submitting}
        >
          <FaPlus aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
