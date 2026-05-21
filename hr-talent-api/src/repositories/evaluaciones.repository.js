const pool = require('../config/database');

async function findByCandidato(candidatoId) {
  const { rows } = await pool.query(
    `SELECT e.*, u.nombre AS evaluador_nombre
     FROM evaluaciones e
     LEFT JOIN usuarios_rrhh u ON e.evaluador_id = u.id
     WHERE e.candidato_id=$1
     ORDER BY e.fecha DESC`,
    [candidatoId]
  );
  return rows;
}

async function create(data) {
  const { candidato_id, vacante_id, evaluador_id, tipo, puntaje_tecnico, puntaje_actitudinal, puntaje_cultural, comentarios } = data;
  const { rows } = await pool.query(
    `INSERT INTO evaluaciones
      (candidato_id, vacante_id, evaluador_id, tipo, puntaje_tecnico, puntaje_actitudinal, puntaje_cultural, comentarios)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [candidato_id, vacante_id, evaluador_id, tipo, puntaje_tecnico, puntaje_actitudinal, puntaje_cultural, comentarios]
  );
  return rows[0];
}

module.exports = { findByCandidato, create };
