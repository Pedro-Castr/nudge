import styles from "./stain.module.css";

export default function Stain() {
  return (
    <div className={styles.clip}>
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className={styles.blob} />
      ))}
    </div>
  );
}
