import { TOPO_PATH, TOPO_VIEWBOX } from "./topoPaths";
import styles from "./topo.module.css";

export default function Topo() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.layer}>
        <svg
          className={styles.map}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={TOPO_VIEWBOX}
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d={TOPO_PATH}
            fill="none"
            stroke="#fff"
            strokeWidth="1.2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
