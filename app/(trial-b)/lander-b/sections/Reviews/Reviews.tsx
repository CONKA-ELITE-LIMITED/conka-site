/**
 * CONKA — "Real people. Real results." review rail.
 * Static content from ./reviews.data.ts. No commerce dependency.
 * Server component is fine (horizontal scroll is pure CSS).
 *
 * LATER: swap the hard-coded REVIEWS for live reviews from your reviews app
 * (Okendo / Judge.me / Loox) via its API — the card shape stays identical.
 */

import styles from './Reviews.module.css';
import { REVIEWS, REVIEW_COUNT } from './reviews.data';

export default function Reviews() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          Real people.
          <br />
          Real results.
        </h2>
        <p className={styles.sub}>A few favourites from our {REVIEW_COUNT} verified reviews.</p>
      </div>
      <div className={styles.rail}>
        {REVIEWS.map((r, i) => (
          <article className={styles.card} key={`${r.name}-${i}`}>
            <div className={styles.meta}>
              <span className={styles.verified}>✓ Verified</span>
              <span
                className={`${styles.tag} ${r.product === 'CONKA FLOW' ? styles.tagFlow : styles.tagBoth}`}
              >
                {r.product}
              </span>
            </div>
            <div className={styles.stars}>
              ★★★★★ <span>{r.rating}</span>
            </div>
            <h3 className={styles.hl}>{r.headline}</h3>
            <p className={styles.body}>{r.body}</p>
            <div className={styles.author}>
              <img className={styles.avatar} src={r.avatar} alt={r.name} loading="lazy" />
              <span className={styles.name}>{r.name}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
