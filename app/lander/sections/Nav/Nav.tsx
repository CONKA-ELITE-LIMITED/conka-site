'use client';


/**
 * CONKA — announcement bar + header. Rebuilt from the prototype.
 *
 * - Mobile (<1000px): announcement bar, then burger(MENU) / logo / cart, plus a
 *   slide-out menu (FLOW/CLEAR/BOTH + section links + Login).
 * - Desktop (≥1000px): announcement bar, then a two-row header — logo + Login/Cart
 *   on top, centred nav links below. "Shop CONKA" opens the 3-up mega-menu.
 *
 * Links point at /products/* and /pages/* — repoint to your Hydrogen routes.
 * The cart button should open your cart drawer (wire `onCartClick`).
 */

import { useState } from 'react';
import Link from 'next/link';
import styles from './Nav.module.css';

const PRODUCTS = [
  { title: 'FLOW', desc: 'Morning focus & energy', href: '/conka-flow', img: '/lander/FlowNew.jpg' },
  { title: 'CLEAR', desc: 'Afternoon clarity & brain recovery', href: '/conka-clarity', img: '/lander/ClearNew.jpg' },
  { title: 'BOTH', desc: 'The full daily system', href: '/conka-both', img: '/formulas/both/BothNew.jpg' },
];
const LINKS = [
  { label: 'Reviews', href: '#reviews' },
  { label: 'Science', href: '/science' },
  { label: 'Our Partners', href: '#partners' },
  { label: 'About Us', href: '/our-story' },
];

const Chevron = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14,8 L10,12 L6,8" stroke="currentColor" strokeLinecap="round" />
  </svg>
);
const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.75 10.5V6C15.75 3.92893 14.0711 2.25 12 2.25C9.92893 2.25 8.25 3.92893 8.25 6V10.5M19.606 8.50723L20.8692 20.5072C20.9391 21.1715 20.4183 21.75 19.7504 21.75H4.24963C3.58172 21.75 3.06089 21.1715 3.13081 20.5072L4.39397 8.50723C4.45424 7.93466 4.93706 7.5 5.51279 7.5H18.4872C19.0629 7.5 19.5458 7.93466 19.606 8.50723Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

interface NavProps {
  onCartClick?: () => void;
}

export default function Nav({ onCartClick }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  // Standalone lander has no cart drawer — the cart icon scrolls to the buy
  // section (or calls onCartClick if a host app provides one).
  const handleCart = () => {
    if (onCartClick) return onCartClick();
    document.getElementById('purchase-section')?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <>
      <div className={styles.announce}>
        <p className={styles.announceCopy}>
          <b>Limited-Time Offer!</b> Subscribe to claim 31% off + free delivery
          <a className={styles.announceLink} href="#purchase-section">
            &nbsp;Get Now
            <Chevron />
          </a>
        </p>
      </div>

      <header className={styles.header}>
        {/* Mobile bar */}
        <div className={styles.mobileBar}>
          <button className={styles.burger} aria-label="Open menu" onClick={() => setMobileOpen(true)}>
            <span className={styles.burgerIcon}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.menuText}>MENU</span>
          </button>
          <Link className={styles.logo} href="/" aria-label="CONKA home">
            <img src="/lander/conka-logo.webp" alt="CONKA logo" width={121} height={32} />
          </Link>
          <button className={styles.iconBtn} aria-label="Cart" onClick={handleCart}>
            <CartIcon />
          </button>
        </div>

        {/* Desktop nav */}
        <div
          className={styles.desktopNav}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className={styles.topBar}>
            <Link className={styles.logo} href="/" aria-label="CONKA home">
              <img src="/lander/conka-logo.webp" alt="CONKA logo" width={121} height={32} />
            </Link>
            <div className={styles.userNav}>
              <a href="/account/login">Login</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleCart(); }} aria-label="Cart">
                <CartIcon />
              </a>
            </div>
          </div>
          <div className={styles.centeredBar}>
            <button
              className={styles.navLink}
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
            >
              Shop CONKA <Chevron />
            </button>
            {LINKS.map((l) => (
              <a key={l.label} className={styles.navLink} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>

          {megaOpen && (
            <div className={styles.dropdown}>
              <div className={styles.ddInner}>
                <div className={styles.ddCols}>
                  {PRODUCTS.map((p) => (
                    <a key={p.title} className={styles.ddItem} href={p.href}>
                      <img src={p.img} alt={`CONKA ${p.title}`} />
                      <p className={styles.ddTitle}>{p.title}</p>
                      <p className={styles.ddDesc}>{p.desc}</p>
                    </a>
                  ))}
                </div>
                <div className={styles.shopAll}>
                  <a className={styles.shopAllLink} href="/funnel">Shop All</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuOverlay} onClick={() => setMobileOpen(false)} />
          <nav className={styles.mobileMenuPanel}>
            <button className={styles.mobileMenuClose} aria-label="Close menu" onClick={() => setMobileOpen(false)}>
              ×
            </button>
            <div className={styles.mobileProducts}>
              {PRODUCTS.map((p) => (
                <a key={p.title} className={styles.mobileProduct} href={p.href}>
                  <img src={p.img} alt={`CONKA ${p.title}`} />
                  <span>
                    <b>{p.title}</b>
                    <span>{p.desc}</span>
                  </span>
                </a>
              ))}
            </div>
            <div className={styles.mobileLinks}>
              {LINKS.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
              <a href="/account/login">Login</a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
