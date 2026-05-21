const pool = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(
    'SELECT * FROM vacantes ORDER BY fecha_publicacion DESC'
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM vacantes WHERE id=$1', [id]);
  return rows[0];
}

async function create(data) {
  const { titulo, descripcion, departamento, requisitos, salario_min, salario_max, responsable_id } = data;
  const { rows } = await pool.query(
    `INSERT INTO vacantes (titulo, descripcion, departamento, requisitos, salario_min, salario_max, responsable_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [titulo, descripcion, departamento, requisitos, salario_min, salario_max, responsable_id]
  );
  return rows[0];
}

async function update(id, data) {
  const { titulo, descripcion, departamento, requisitos, salario_min, salario_max, estado } = data;
  const { rows } = await pool.query(
    `UPDATE vacantes SET titulo=$1, descripcion=$2, departamento=$3, requisitos=$4,
      salario_min=$5, salario_max=$6, estado=$7, updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [titulo, descripcion, departamento, requisitos, salario_min, salario_max, estado, id]
  );
  return rows[0];
}

module.exports = { findAll, findById, create, update };
