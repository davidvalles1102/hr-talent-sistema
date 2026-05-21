const repo = require('../repositories/reportes.repository');

async function getTalentos() {
  const metricas = await repo.getMetricasTalentos();
  const porVacante = await repo.getCandidatosPorVacante();
  return { metricas, por_vacante: porVacante };
}

module.exports = { getTalentos };
