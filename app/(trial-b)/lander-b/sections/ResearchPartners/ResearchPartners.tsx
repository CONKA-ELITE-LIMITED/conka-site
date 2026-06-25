/**
 * CONKA — "World-Class Research. World-Class Results." partner band.
 * Static, no commerce dependency. Background photo + university chips.
 * Server component is fine (no client interactivity).
 */

import Image from 'next/image';
import styles from './ResearchPartners.module.css';

const UNIVERSITIES = [
  { src: '/lander/unilogos/UniversityOfCambridge.png', alt: 'University of Cambridge' },
  { src: '/lander/unilogos/UniversityOfDurham.png', alt: 'Durham University' },
  { src: '/lander/unilogos/UniversityOfExeter.png', alt: 'University of Exeter' },
];

export default function ResearchPartners() {
  return (
    <section className={styles.section}>
      {/* Decorative full-bleed background — was a 1.3 MB CSS background-image
          (unoptimizable). As next/image it serves AVIF/WebP + responsive sizes.
          alt="" + sits behind the scrim (::before) and content via z-index. */}
      <Image
        className={styles.bg}
        src="/lander/research-bg.jpg"
        alt=""
        fill
        sizes="100vw"
      />
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
