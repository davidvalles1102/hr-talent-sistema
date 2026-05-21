const repo = require('../repositories/candidatos.repository');

async function listar() {
  return repo.findAll();
}

async function obtener(id) {
  const candidato = await repo.findById(id);
  if (!candidato) {
    const err = new Error('Candidato no encontrado');
    err.status = 404;
    throw err;
  }
  return candidato;
}

async function crear(data) {
  return repo.create(data);
}

async function actualizar(id, data) {
  await obtener(id);
  return repo.update(id, data);
}

async function eliminar(id) {
  await obtener(id);
  return repo.remove(id);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
