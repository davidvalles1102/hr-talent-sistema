'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>👥</span>
        <span>HR Talent</span>
      </div>

      <button
        className={styles.hamburger}
        onClick={() => setOpen(v => !v)}
        aria-label="Menú"
        aria-expanded={open}
      >
        {open ? '✕' : '☰'}
      </button>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        <li><Link href="/"              onClick={close}>Dashboard</Link></li>
        <li><Link href="/candidatos"    onClick={close}>Candidatos</Link></li>
        <li><Link href="/vacantes"      onClick={close}>Vacantes</Link></li>
        <li className={styles.separator}>Ejemplos:</li>
        <li><Link href="/ejemplos/hooks"       onClick={close}>Hooks</Link></li>
        <li><Link href="/ejemplos/props"       onClick={close}>Props</Link></li>
        <li><Link href="/ejemplos/reactstrap"  onClick={close}>Reactstrap</Link></li>
      </ul>
    </nav>
  );
}
