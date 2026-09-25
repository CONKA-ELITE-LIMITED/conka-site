import TestContainer from "./TestContainer";
import styles from "./engine.module.css";

interface InstructionsProps {
  imageCount: number;
  ready: boolean;
  onStart: () => void;
}

/** The two answers on their own halves, one line of how-to, and Start. */
export default function Instructions({ imageCount, ready, onStart }: InstructionsProps) {
  return (
    <TestContainer>
      <div className={`${styles.sideLabel} ${styles.sideLabelLeft}`}>
        <span className={styles.sideKey}>Left</span>
        <span className={styles.sideName}>Non-animal</span>
      </div>
      <div className={`${styles.sideLabel} ${styles.sideLabelRight}`}>
        <span className={styles.sideKey}>Right</span>
        <span className={styles.sideName}>Animal</span>
        <span className={styles.sideNote}>animals, birds and insects</span>
      </div>
      <div className={styles.panel}>
        <p className={styles.panelText}>
          An image flashes for a split second. Tap the side it belongs to, as fast as you can.
        </p>
        <button type="button" className={styles.button} disabled={!ready} onClick={onStart}>
          {ready ? "Start" : "Loading"}
        </button>
        <p className={styles.panelMeta}>
          {imageCount} images, {imageCount <= 20 ? "under a minute" : "about 2 minutes"}. Best on a phone; on a
          computer, click the left or right side.
        </p>
      </div>
    </TestContainer>
  );
}
