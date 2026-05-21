const service = require('../services/vacantes.service');

async function listar(req, res, next) {
  try {
    const data = await service.listar();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function obtener(req, res, next) {
  try {
    const data = await service.obtener(req.params.id);
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

async function actualizar(req, res, next) {
  try {
    const data = await service.actualizar(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtener, crear, actualizar };
