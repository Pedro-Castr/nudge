import styles from "./background.module.css";

export default function Background() {
  return (
    <div className={styles.root} aria-hidden="true">
      <span className={styles.small} />
      <span className={styles.large} />
    </div>
  );
}
