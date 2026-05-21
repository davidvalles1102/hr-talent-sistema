const repo = require('../repositories/evaluaciones.repository');

async function obtenerPorCandidato(candidatoId) {
  return repo.findByCandidato(candidatoId);
}

async function crear(data) {
  return repo.create(data);
}

module.exports = { obtenerPorCandidato, crear };
