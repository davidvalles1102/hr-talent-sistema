const service = require('../services/reportes.service');

async function getTalentos(req, res, next) {
  try {
    const data = await service.getTalentos();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTalentos };
