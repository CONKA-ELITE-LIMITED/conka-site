/**
 * CONKA — "Fueling High Performers at:" partner-logo marquee. Server component.
 * Pure CSS animation (no JS). Two identical groups loop seamlessly.
 * Per-logo heights match the prototype (logos differ in natural proportions).
 */

import Image from 'next/image';
import styles from './LogoMarquee.module.css';

// nw/nh = natural pixel dimensions (for next/image aspect ratio); h = display
// height. next/image serves a small AVIF/WebP at the rendered size and
// lazy-loads (no priority) so these sit below the hero's LCP instead of
// competing with it. The source PNGs are ~500px crests (70–115 KB each) but
// only ever render ~50 px tall — the optimizer collapses them to a few KB.
const LOGOS = [
  { src: '/lander/partners/bath-rugby.png', alt: 'Bath Rugby', h: 52, nw: 200, nh: 200 },
  { src: '/lander/partners/southampton.png', alt: 'Southampton FC', h: 54, nw: 500, nh: 571 },
  { src: '/lander/partners/england-rugby.png', alt: 'England Rugby', h: 58, nw: 500, nh: 834 },
  { src: '/lander/partners/bayern.png', alt: 'FC Bayern Munich', h: 52, nw: 500, nh: 500 },
  { src: '/lander/partners/team-gb.png', alt: 'Team GB', h: 58, nw: 500, nh: 682 },
  { src: '/lander/partners/wales-rugby.png', alt: 'Wales Rugby', h: 56, nw: 500, nh: 662 },
  { src: '/lander/partners/leeds.png', alt: 'Leeds United', h: 54, nw: 500, nh: 623 },
  { src: '/lander/partners/wolves.png', alt: 'Wolves', h: 48, nw: 500, nh: 434 },
  { src: '/lander/partners/f1.png', alt: 'Formula 1', h: 26, nw: 500, nh: 125 },
  { src: '/lander/partners/barrys.png', alt: "Barry's", h: 22, nw: 500, nh: 103 },
  { src: '/lander/partners/army.png', alt: 'British Army', h: 46, nw: 500, nh: 427 },
  { src: '/lander/partners/british-airways.png', alt: 'British Airways', h: 18, nw: 500, nh: 79 },
  { src: '/lander/partners/goldman-sachs.png', alt: 'Goldman Sachs', h: 36, nw: 500, nh: 210 },
  { src: '/lander/partners/equinox.png', alt: 'Equinox', h: 19, nw: 500, nh: 95 },
];

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {LOGOS.map((l) => (
        <Image
          key={l.alt}
          src={l.src}
          alt={l.alt}
          width={l.nw}
          height={l.nh}
          sizes="160px"
          style={{ height: l.h, width: 'auto' }}
        />
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
