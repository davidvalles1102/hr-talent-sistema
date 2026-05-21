const pool = require('../config/database');

async function getMetricasTalentos() {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*)                                              AS total_candidatos,
      COUNT(*) FILTER (WHERE estado='activo')              AS activos,
      COUNT(*) FILTER (WHERE estado='contratado')          AS contratados,
      COUNT(*) FILTER (WHERE estado='descartado')          AS descartados,
      ROUND(AVG(e.puntaje_total), 2)                       AS promedio_puntaje
    FROM candidatos c
    LEFT JOIN (
      SELECT candidato_id,
        ROUND((puntaje_tecnico + puntaje_actitudinal + puntaje_cultural) / 3.0, 2) AS puntaje_total
      FROM evaluaciones
    ) e ON c.id = e.candidato_id
    WHERE c.activo = true
  `);
  return rows[0];
}

async function getCandidatosPorVacante() {
  const { rows } = await pool.query(`
    SELECT v.titulo, COUNT(e.candidato_id) AS total_candidatos,
           ROUND(AVG((e.puntaje_tecnico+e.puntaje_actitudinal+e.puntaje_cultural)/3.0),2) AS promedio_puntaje
    FROM vacantes v
    LEFT JOIN evaluaciones e ON v.id = e.vacante_id
    GROUP BY v.id, v.titulo
    ORDER BY total_candidatos DESC
  `);
  return rows;
}

module.exports = { getMetricasTalentos, getCandidatosPorVacante };
