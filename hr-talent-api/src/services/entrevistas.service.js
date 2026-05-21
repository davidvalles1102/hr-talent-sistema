const repo = require('../repositories/entrevistas.repository');

async function listar() {
  return repo.findAll();
}

async function agendar(data) {
  return repo.create(data);
}

async function actualizarEstado(id, estado) {
  const entrevista = await repo.updateEstado(id, estado);
  if (!entrevista) {
    const err = new Error('Entrevista no encontrada');
    err.status = 404;
    throw err;
  }
  return entrevista;
}

module.exports = { listar, agendar, actualizarEstado };
