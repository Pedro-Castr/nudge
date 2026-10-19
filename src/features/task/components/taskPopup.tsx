"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { FaPencil, FaTrashCan, FaXmark } from "react-icons/fa6";

import taskService from "@/features/task/services/taskService";
import { getChanges } from "@/features/task/utils/getChanges";
import type { Task } from "@/features/task/types/task";

import itemStyles from "./taskItem.module.css";
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
      setError(err instanceof Error ? err.message : "Algo deu errado.");
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
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    }
  }

  return (
    <>
      <button
        type="button"
        className={itemStyles.open}
        popoverTarget={popupId}
        aria-label={`Ver detalhes: ${task.nome}`}
        onClick={() => {
          setEditing(false);
          setError(null);
        }}
      />

      <div id={popupId} popover="auto" className={styles.popup}>
        {editing ? (
          <form className={styles.editForm} onSubmit={handleSave}>
            <h3 className={styles.popupTitle}>Editar tarefa</h3>

            <label className={styles.editField}>
              Nome
              <input
                className={styles.editInput}
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

            <label className={styles.editField}>
              Detalhes (opcional)
              <textarea
                className={styles.editTextarea}
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
              <p role="alert" className={styles.popupError}>
                {error}
              </p>
            )}

            <div className={styles.popupFooter}>
              <button
                type="button"
                className={styles.popupButton}
                onClick={() => setEditing(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={`${styles.popupButton} ${styles.popupPrimary}`}
                disabled={saving}
              >
                Salvar
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className={styles.popupTitle}>{task.nome}</h3>

            {task.descricao ? (
              <p className={styles.popupText}>{task.descricao}</p>
            ) : (
              <p className={styles.popupEmpty}>Sem descrição.</p>
            )}

            {error && (
              <p role="alert" className={styles.popupError}>
                {error}
              </p>
            )}

            <div className={styles.popupFooter}>
              <button
                type="button"
                className={styles.popupButton}
                onClick={startEdit}
              >
                <FaPencil />
                Editar
              </button>

              <button
                type="button"
                className={`${styles.popupButton} ${styles.popupDanger}`}
                onClick={handleDelete}
              >
                <FaTrashCan />
                Excluir
              </button>
            </div>
          </>
        )}

        <button
          type="button"
          className={styles.popupClose}
          popoverTarget={popupId}
          popoverTargetAction="hide"
          aria-label="Fechar"
        >
          <FaXmark />
        </button>
      </div>
    </>
  );
}
