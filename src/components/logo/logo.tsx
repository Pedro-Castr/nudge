import styles from "./logo.module.css";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="12" cy="20" r="5" fill="currentColor" fillOpacity="0.45" />
        <circle cx="25" cy="20" r="10" fill="currentColor" />
      </svg>
      <span className={styles.logoWord}>nudge</span>
    </div>
  );
}
