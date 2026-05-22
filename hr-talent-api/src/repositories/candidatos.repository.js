const pool = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(
    'SELECT * FROM candidatos WHERE activo = true ORDER BY fecha_registro DESC'
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM candidatos WHERE id = $1',
    [id]
  );
  return rows[0];
}

async function create(data) {
  const { nombre, apellido, email, telefono, puesto_interes, nivel_educativo, anios_experiencia, cv_url, notas } = data;
  const { rows } = await pool.query(
    `INSERT INTO candidatos (nombre, apellido, email, telefono, puesto_interes, nivel_educativo, anios_experiencia, cv_url, notas)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [nombre, apellido, email, telefono, puesto_interes, nivel_educativo || null, anios_experiencia || 0, cv_url, notas]
  );
  return rows[0];
}

async function update(id, data) {
  const { nombre, apellido, email, telefono, puesto_interes, nivel_educativo, anios_experiencia, cv_url, notas, estado } = data;
  const { rows } = await pool.query(
    `UPDATE candidatos
     SET nombre=$1, apellido=$2, email=$3, telefono=$4,
         puesto_interes=$5, nivel_educativo=$6, anios_experiencia=$7,
         cv_url=$8, notas=$9, estado=$10,
         updated_at=NOW()
     WHERE id=$11 RETURNING *`,
    [nombre, apellido, email, telefono, puesto_interes, nivel_educativo || null, anios_experiencia || 0, cv_url, notas, estado, id]
  );
  return rows[0];
}

async function remove(id) {
  const { rows } = await pool.query(
    'UPDATE candidatos SET activo=false, updated_at=NOW() WHERE id=$1 RETURNING *',
    [id]
  );
  return rows[0];
}

module.exports = { findAll, findById, create, update, remove };
