"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { FaPencil, FaTrashCan, FaXmark } from "react-icons/fa6";

import { getErrorText } from "@/lib/api";
import taskService from "@/features/task/services/taskService";
import { getChanges } from "@/features/task/utils/getChanges";
import type { Task } from "@/features/task/types/task";

import styles from "./taskPopup.module.css";

interface TaskPopupProps {
  task: Task;
}

export default function TaskPopup({ task }: TaskPopupProps) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(task.nome);
  const [descricao, setDescricao] = useState(task.descricao ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const popupId = `detalhes-${task.id}`;

  function startEdit() {
    setNome(task.nome);
    setDescricao(task.descricao ?? "");
    setError(null);
    setEditing(true);
  }

  async function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const changes = getChanges(task, {
      nome: nome.trim(),
      descricao: descricao.trim() || null,
    });

    if (Object.keys(changes).length === 0) {
      setEditing(false);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await taskService.updateTask(task.id, changes);
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(getErrorText(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setError(null);

    try {
      await taskService.deleteTask(task.id);
      router.refresh();
    } catch (err) {
      setError(getErrorText(err));
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.open}
        popoverTarget={popupId}
        aria-label={`Ver detalhes: ${task.nome}`}
        onClick={() => {
          setEditing(false);
          setError(null);
        }}
      />

      <div id={popupId} popover="auto" className={styles.popup}>
        <header className={styles.header}>
          <h3 className={styles.title}>
            {editing ? "Editar tarefa" : task.nome}
          </h3>

          <button
            type="button"
            className={styles.close}
            popoverTarget={popupId}
            popoverTargetAction="hide"
            aria-label="Fechar"
          >
            <FaXmark aria-hidden="true" />
          </button>
        </header>

        {editing ? (
          <form className={styles.form} onSubmit={handleSave}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Nome</span>
              <input
                className={styles.input}
                type="text"
                name="nome"
                maxLength={100}
                autoComplete="off"
                autoFocus
                required
                value={nome}
                onChange={(event) => {
                  setNome(event.target.value);
                  setError(null);
                }}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Detalhes (opcional)</span>
              <textarea
                className={styles.textarea}
                name="descricao"
                maxLength={256}
                rows={3}
                value={descricao}
                onChange={(event) => {
                  setDescricao(event.target.value);
                  setError(null);
                }}
              />
            </label>

            {error && (
              <p role="alert" className={styles.error}>
                {error}
              </p>
            )}

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.button}
                onClick={() => setEditing(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={`${styles.button} ${styles.primary}`}
                disabled={saving}
              >
                {saving ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {task.descricao ? (
              <p className={styles.text}>{task.descricao}</p>
            ) : (
              <p className={styles.empty}>Sem descrição.</p>
            )}

            {error && (
              <p role="alert" className={styles.error}>
                {error}
              </p>
            )}

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.button}
                onClick={startEdit}
              >
                <FaPencil aria-hidden="true" />
                Editar
              </button>

              <button
                type="button"
                className={`${styles.button} ${styles.danger}`}
                onClick={handleDelete}
              >
                <FaTrashCan aria-hidden="true" />
                Excluir
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
