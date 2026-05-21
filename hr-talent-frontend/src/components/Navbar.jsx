// Componente de navegación — Server Component (sin 'use client')
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>👥</span>
        <span>HR Talent</span>
      </div>
      <ul className={styles.links}>
        <li><Link href="/">Dashboard</Link></li>
        <li><Link href="/candidatos">Candidatos</Link></li>
        <li><Link href="/vacantes">Vacantes</Link></li>
        <li className={styles.separator}>Ejemplos:</li>
        <li><Link href="/ejemplos/hooks">Hooks</Link></li>
        <li><Link href="/ejemplos/props">Props</Link></li>
        <li><Link href="/ejemplos/reactstrap">Reactstrap</Link></li>
      </ul>
    </nav>
  );
}
