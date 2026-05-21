// ============================================================
//  COMPONENTE — CandidatoCard  (sin librerías externas)
//
//  PROPS que recibe:
//    candidato  {Candidato}  — objeto del modelo
//    onEliminar {Function}   — callback cuando se elimina
// ============================================================
import styles from './CandidatoCard.module.css';

export default function CandidatoCard({ candidato, onEditar, onEliminar }) {
  const badge = candidato.estadoBadge;

  return (
    <div className={styles.card}>
      {/* Avatar con iniciales */}
      <div className={styles.avatar}>{candidato.iniciales}</div>

      <div className={styles.info}>
        <h3 className={styles.nombre}>{candidato.nombreCompleto}</h3>
        <p className={styles.puesto}>{candidato.puesto_interes}</p>
        <p className={styles.email}>{candidato.email}</p>

        <div className={styles.meta}>
          <span>📚 {candidato.nivel_educativo || 'No especificado'}</span>
          <span>💼 {candidato.anios_experiencia} años exp.</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span
          className={styles.badge}
          style={{ color: badge.color, background: badge.bg }}
        >
          {badge.label}
        </span>

        <div style={{ display: 'flex', gap: '.5rem' }}>
          {onEditar && (
            <button
              className={styles.btnEditar}
              onClick={() => onEditar(candidato)}
            >
              Editar
            </button>
          )}
          {onEliminar && (
            <button
              className={styles.btnEliminar}
              onClick={() => onEliminar(candidato.id)}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
