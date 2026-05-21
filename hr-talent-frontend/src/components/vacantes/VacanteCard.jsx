// COMPONENTE — VacanteCard (sin librerías externas)
// PROPS: vacante {Vacante}
import styles from './VacanteCard.module.css';

export default function VacanteCard({ vacante }) {
  const badge = vacante.estadoBadge;
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.modalidad}>{vacante.modalidadIcon} {vacante.modalidad}</span>
        <span className={styles.badge} style={{ color: badge.color, background: badge.bg }}>
          {badge.label}
        </span>
      </div>
      <h3 className={styles.titulo}>{vacante.titulo}</h3>
      <p className={styles.depto}>🏢 {vacante.departamento}</p>
      <p className={styles.desc}>{vacante.descripcion}</p>
      <div className={styles.salario}>💰 {vacante.rangoSalario}</div>
    </div>
  );
}
