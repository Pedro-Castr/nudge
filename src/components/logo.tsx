import styles from "./logo.module.css";

type LogoProps = {
  /** Altura do símbolo em px. */
  size?: number;
  showWordmark?: boolean;
  className?: string;
};

export default function Logo({
  size = 32,
  showWordmark = true,
  className,
}: LogoProps) {
  const width = Math.round((size * 40) / 28);

  return (
    <span className={`${styles.root} ${className ?? ""}`}>
      <svg
        className={styles.mark}
        width={width}
        height={size}
        viewBox="0 0 40 28"
        {...(showWordmark
          ? { "aria-hidden": true }
          : { role: "img", "aria-label": "Nudge" })}
      >
        <circle className={styles.small} cx="9" cy="14" r="7" />
        <circle className={styles.large} cx="27" cy="14" r="12" />
      </svg>
      {showWordmark && (
        <span className={styles.wordmark} style={{ fontSize: size * 0.86 }}>
          nudge
        </span>
      )}
    </span>
  );
}
