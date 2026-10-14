import type { ReactNode } from "react";
import type { Task } from "@/features/task/types/task";

import styles from "./taskItem.module.css";

interface TaskItemProps {
  task: Task;
}

function Icon({
  children,
  size = 18,
  strokeWidth = 2,
}: {
  children: ReactNode;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function CheckIcon() {
  return (
    <Icon size={20} strokeWidth={2.6}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Icon>
  );
}

function EditIcon() {
  return (
    <Icon>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </Icon>
  );
}

function TrashIcon() {
  return (
    <Icon>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </Icon>
  );
}

function CloseIcon() {
  return (
    <Icon>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

function HandleIcon() {
  return (
    <svg
      className={styles.handle}
      width="14"
      height="20"
      viewBox="0 0 14 20"
      aria-hidden="true"
    >
      {[4, 10, 16].flatMap((cy) =>
        [4, 10].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" />
        )),
      )}
    </svg>
  );
}

export default function TaskItem({ task }: TaskItemProps) {
  const popupId = `detalhes-${task.id}`;
  const completeLabel = task.concluida ? "Reabrir tarefa" : "Concluir tarefa";

  return (
    <li className={`${styles.item} ${task.concluida ? styles.itemDone : ""}`}>
      {/* Cobre o card inteiro; a alça e o concluir ficam por cima dele */}
      <button
        type="button"
        className={styles.open}
        popoverTarget={popupId}
        aria-label={`Ver detalhes: ${task.nome}`}
      />

      {!task.concluida && (
        <button
          type="button"
          className={styles.handleArea}
          aria-label="Reordenar tarefa"
          title="Arraste para reordenar"
        >
          <HandleIcon />
        </button>
      )}

      <span className={styles.nome}>{task.nome}</span>

      <button
        type="button"
        className={styles.complete}
        aria-label={completeLabel}
        title={completeLabel}
      >
        <CheckIcon />
      </button>

      <div id={popupId} popover="auto" className={styles.popup}>
        <h3 className={styles.popupTitle}>{task.nome}</h3>

        {task.descricao ? (
          <p className={styles.popupText}>{task.descricao}</p>
        ) : (
          <p className={styles.popupEmpty}>Sem descrição.</p>
        )}

        <div className={styles.popupFooter}>
          <button type="button" className={styles.popupButton}>
            <EditIcon />
            Editar
          </button>
          <button
            type="button"
            className={`${styles.popupButton} ${styles.popupDanger}`}
          >
            <TrashIcon />
            Excluir
          </button>
        </div>

        <button
          type="button"
          className={styles.popupClose}
          popoverTarget={popupId}
          popoverTargetAction="hide"
          aria-label="Fechar"
        >
          <CloseIcon />
        </button>
      </div>
    </li>
  );
}
