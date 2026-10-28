import styles from "./waves.module.css";

const WAVE = "M0 100 C300 20 900 180 1200 100 L1200 200 L0 200 Z";

export default function Waves() {
  return (
    <div className={styles.clip}>
      {[0, 1, 2].map((layer) => (
        <svg
          key={layer}
          className={styles.wave}
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path d={WAVE} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
