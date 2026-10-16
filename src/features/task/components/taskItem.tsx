"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  FaCheck,
  FaPencil,
  FaTrashCan,
  FaXmark,
  FaArrowRotateLeft,
} from "react-icons/fa6";
import { LuGrip } from "react-icons/lu";

import taskService from "@/features/task/services/taskService";
import { getChanges } from "@/features/task/utils/getChanges";
import type { Task } from "@/features/task/types/task";
import styles from "./taskItem.module.css";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const [completing, setCompleting] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(task.nome);
  const [descricao, setDescricao] = useState(task.descricao ?? "");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const popupId = `detalhes-${task.id}`;
  const completeLabel = task.concluida ? "Reabrir tarefa" : "Concluir tarefa";

  async function handleToggle() {
    if (completing) return;

    setCompleting(true);
    setToggleError(null);

    try {
      await taskService.updateTask(task.id, { concluida: !task.concluida });
      startTransition(() => router.refresh());
    } catch (err) {
      setToggleError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setCompleting(false);
    }
  }

  function startEdit() {
    setNome(task.nome);
    setDescricao(task.descricao ?? "");
    setEditError(null);
    setEditing(true);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
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
    setEditError(null);

    try {
      await taskService.updateTask(task.id, changes);
      setEditing(false);
      startTransition(() => router.refresh());
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await taskService.deleteTask(task.id);
      startTransition(() => router.refresh());
    } catch (err) {
      setToggleError(err instanceof Error ? err.message : "Algo deu errado.");
    }
  }

  return (
    <li className={`${styles.item} ${task.concluida ? styles.itemDone : ""}`}>
      <button
        type="button"
        className={styles.open}
        popoverTarget={popupId}
        aria-label={`Ver detalhes: ${task.nome}`}
        onClick={() => setEditing(false)}
      />

      {!task.concluida && (
        <button
          type="button"
          className={styles.handleArea}
          aria-label="Reordenar tarefa"
          title="Arraste para reordenar"
        >
          <LuGrip />
        </button>
      )}

      <div className={styles.text}>
        <span className={styles.nome}>{task.nome}</span>
        {toggleError && (
          <span role="alert" className={styles.cardError}>
            {toggleError}
          </span>
        )}
      </div>

      <button
        type="button"
        className={styles.complete}
        aria-label={completeLabel}
        title={completeLabel}
        onClick={handleToggle}
        disabled={completing || isRefreshing}
      >
        {(!task.concluida && <FaCheck />) || <FaArrowRotateLeft />}
      </button>

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
                onChange={(e) => {
                  setNome(e.target.value);
                  setEditError(null);
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
                onChange={(e) => {
                  setDescricao(e.target.value);
                  setEditError(null);
                }}
              />
            </label>

            {editError && (
              <p role="alert" className={styles.popupError}>
                {editError}
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
    </li>
  );
}
