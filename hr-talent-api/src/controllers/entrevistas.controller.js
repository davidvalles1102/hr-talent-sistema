const service = require('../services/entrevistas.service');

async function listar(req, res, next) {
  try {
    const data = await service.listar();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function agendar(req, res, next) {
  try {
    const data = await service.agendar(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function actualizarEstado(req, res, next) {
  try {
    const data = await service.actualizarEstado(req.params.id, req.body.estado);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, agendar, actualizarEstado };
