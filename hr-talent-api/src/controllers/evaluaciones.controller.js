const service = require('../services/evaluaciones.service');

async function obtenerPorCandidato(req, res, next) {
  try {
    const data = await service.obtenerPorCandidato(req.params.candidatoId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const data = await service.crear(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { obtenerPorCandidato, crear };
