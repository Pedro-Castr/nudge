import styles from "./paper.module.css";

export default function Paper() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.light} />
      <div className={styles.grain} />
    </div>
  );
}
