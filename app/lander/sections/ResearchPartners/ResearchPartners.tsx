/**
 * CONKA — "World-Class Research. World-Class Results." partner band.
 * Static, no commerce dependency. Background photo + university chips.
 * Server component is fine (no client interactivity).
 */

import styles from './ResearchPartners.module.css';

const UNIVERSITIES = [
  { src: '/lander/unilogos/UniversityOfCambridge.png', alt: 'University of Cambridge' },
  { src: '/lander/unilogos/UniversityOfDurham.png', alt: 'Durham University' },
  { src: '/lander/unilogos/UniversityOfExeter.png', alt: 'University of Exeter' },
];

export default function ResearchPartners() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <p className={styles.title}>
          World-Class Research.
          <br />
          World-Class Results.
        </p>
        <div className={styles.logos}>
          {UNIVERSITIES.map((u) => (
            <div className={styles.chip} key={u.alt}>
              <img src={u.src} alt={u.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
