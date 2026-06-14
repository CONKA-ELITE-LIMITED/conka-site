/**
 * CONKA — "Fueling High Performers at:" partner-logo marquee. Server component.
 * Pure CSS animation (no JS). Two identical groups loop seamlessly.
 * Per-logo heights match the prototype (logos differ in natural proportions).
 */

import styles from './LogoMarquee.module.css';

const LOGOS = [
  { src: '/lander/partners/bath-rugby.png', alt: 'Bath Rugby', h: 52 },
  { src: '/lander/partners/southampton.png', alt: 'Southampton FC', h: 54 },
  { src: '/lander/partners/england-rugby.png', alt: 'England Rugby', h: 58 },
  { src: '/lander/partners/bayern.png', alt: 'FC Bayern Munich', h: 52 },
  { src: '/lander/partners/team-gb.png', alt: 'Team GB', h: 58 },
  { src: '/lander/partners/wales-rugby.png', alt: 'Wales Rugby', h: 56 },
  { src: '/lander/partners/leeds.png', alt: 'Leeds United', h: 54 },
  { src: '/lander/partners/wolves.png', alt: 'Wolves', h: 48 },
  { src: '/lander/partners/f1.png', alt: 'Formula 1', h: 26 },
  { src: '/lander/partners/barrys.png', alt: "Barry's", h: 22 },
  { src: '/lander/partners/army.png', alt: 'British Army', h: 46 },
  { src: '/lander/partners/british-airways.png', alt: 'British Airways', h: 18 },
  { src: '/lander/partners/goldman-sachs.png', alt: 'Goldman Sachs', h: 36 },
  { src: '/lander/partners/equinox.png', alt: 'Equinox', h: 19 },
];

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {LOGOS.map((l) => (
        <img key={l.alt} src={l.src} alt={l.alt} style={{ height: l.h }} />
      ))}
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <section className={styles.section}>
      <p className={styles.title}>Fueling High Performers at:</p>
      <div className={styles.marquee}>
        <div className={styles.inner}>
          <Group />
          <Group hidden />
        </div>
      </div>
    </section>
  );
}
