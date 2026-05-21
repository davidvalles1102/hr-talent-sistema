const { Router } = require('express');
const ctrl = require('../controllers/reportes.controller');

const router = Router();

router.get('/talentos', ctrl.getTalentos);

module.exports = router;
