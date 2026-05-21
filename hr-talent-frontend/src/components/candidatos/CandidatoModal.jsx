'use client';
import styles from './CandidatoModal.module.css';

export default function CandidatoModal({ isOpen, onClose, titulo, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.titulo}>{titulo}</h2>
          <button className={styles.cerrar} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
