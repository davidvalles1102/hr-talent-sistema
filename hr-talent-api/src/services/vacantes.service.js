const repo = require('../repositories/vacantes.repository');

async function listar() {
  return repo.findAll();
}

async function obtener(id) {
  const vacante = await repo.findById(id);
  if (!vacante) {
    const err = new Error('Vacante no encontrada');
    err.status = 404;
    throw err;
  }
  return vacante;
}

async function crear(data) {
  return repo.create(data);
}

async function actualizar(id, data) {
  await obtener(id);
  return repo.update(id, data);
}

module.exports = { listar, obtener, crear, actualizar };
