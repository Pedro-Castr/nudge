import styles from "./halftone.module.css";

export default function Halftone() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.dots} />
      <div className={`${styles.dots} ${styles.dotsLarge}`} />
    </div>
  );
}
