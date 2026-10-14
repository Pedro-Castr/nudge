import styles from "./taskCompose.module.css";

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function TaskCompose() {
  return (
    <form className={styles.composer}>
      <div className={styles.pill}>
        <span className={styles.dot} aria-hidden="true" />

        <label className={styles.field}>
          <span className={styles.srOnly}>Nome da tarefa</span>
          <input
            className={styles.input}
            type="text"
            name="nome"
            placeholder="Anotar nova tarefa..."
            maxLength={100}
            autoComplete="off"
            required
          />
        </label>

        <button
          type="submit"
          className={styles.submit}
          aria-label="Adicionar tarefa"
          title="Adicionar tarefa"
        >
          <PlusIcon />
        </button>
      </div>

      <div className={styles.details}>
        <div className={styles.detailsInner}>
          <label className={styles.detailsField}>
            <span className={styles.srOnly}>Detalhes (opcional)</span>
            <textarea
              className={styles.textarea}
              name="descricao"
              placeholder="Detalhes (opcional)"
              maxLength={256}
              rows={2}
            />
          </label>
        </div>
      </div>
    </form>
  );
}
