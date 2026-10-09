import styles from "../homePage.module.css";

type PreviewState = "urgent" | "dragging" | "idle";

interface PreviewTask {
  id: number;
  title: string;
  when: string;
  state: PreviewState;
}

const PREVIEW_TASKS: PreviewTask[] = [
  {
    id: 1,
    title: "Pagar o boleto do condomínio",
    when: "Hoje, 18:00",
    state: "urgent",
  },
  {
    id: 2,
    title: "Ligar para o dentista",
    when: "Amanhã, 09:00",
    state: "dragging",
  },
  {
    id: 3,
    title: "Comprar presente de aniversário",
    when: "Sexta, 12:00",
    state: "idle",
  },
];

const TASK_STATE_CLASS: Record<PreviewState, string> = {
  urgent: styles.taskUrgent,
  dragging: styles.taskDragging,
  idle: "",
};

function HandleIcon() {
  return (
    <svg
      className={styles.taskHandle}
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

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default function TaskPreview() {
  return (
    <div className={styles.preview} aria-hidden="true">
      {PREVIEW_TASKS.map((task) => (
        <div
          key={task.id}
          className={`${styles.task} ${TASK_STATE_CLASS[task.state]}`}
        >
          <HandleIcon />
          <span className={styles.taskRank}>{task.id}</span>
          <div className={styles.taskBody}>
            <span className={styles.taskTitle}>{task.title}</span>
            <span className={styles.taskWhen}>
              <ClockIcon />
              {task.when}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
