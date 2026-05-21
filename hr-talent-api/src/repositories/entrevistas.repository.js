const pool = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(
    `SELECT en.*,
            c.nombre || ' ' || c.apellido AS candidato,
            u.nombre AS entrevistador,
            v.titulo AS vacante
     FROM entrevistas en
     LEFT JOIN candidatos c ON en.candidato_id = c.id
     LEFT JOIN usuarios_rrhh u ON en.entrevistador_id = u.id
     LEFT JOIN vacantes v ON en.vacante_id = v.id
     ORDER BY en.fecha_hora ASC`
  );
  return rows;
}

async function create(data) {
  const { candidato_id, vacante_id, entrevistador_id, fecha_hora, modalidad, ubicacion, notas } = data;
  const { rows } = await pool.query(
    `INSERT INTO entrevistas (candidato_id, vacante_id, entrevistador_id, fecha_hora, modalidad, ubicacion, notas)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [candidato_id, vacante_id, entrevistador_id, fecha_hora, modalidad, ubicacion, notas]
  );
  return rows[0];
}

async function updateEstado(id, estado) {
  const { rows } = await pool.query(
    'UPDATE entrevistas SET estado=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
    [estado, id]
  );
  return rows[0];
}

module.exports = { findAll, create, updateEstado };
