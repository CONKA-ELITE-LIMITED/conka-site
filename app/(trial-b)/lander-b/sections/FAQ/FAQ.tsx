/**
 * CONKA lander — FAQ accordion. Server component; native <details> so the
 * expand/collapse works with zero JS. Anchored as #faq (footer link target).
 */

import styles from './FAQ.module.css';
import {FAQ_ITEMS} from './faq.data';

export default function FAQ() {
  return (
    <section id="faq" className={styles.section} aria-label="Frequently asked questions">
      <div className={styles.inner}>
        <h2 className={styles.heading}>Frequently asked questions</h2>
        {FAQ_ITEMS.map((item) => (
          <details className={styles.item} key={item.question}>
            <summary>
              {item.question}
              <span className={styles.pm} aria-hidden="true">
                <span className={styles.bar} />
                <span className={`${styles.bar} ${styles.barV}`} />
              </span>
            </summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
