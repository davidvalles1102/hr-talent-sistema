const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/entrevistas.controller');
const validate = require('../middlewares/validate');

const router = Router();

const rulesAgendar = [
  body('candidato_id').isInt().withMessage('candidato_id debe ser entero'),
  body('entrevistador_id').isInt().withMessage('entrevistador_id debe ser entero'),
  body('fecha_hora').isISO8601().withMessage('fecha_hora debe ser fecha ISO valida'),
  body('modalidad')
    .isIn(['presencial', 'virtual', 'telefonica'])
    .withMessage('Modalidad invalida'),
];

router.get('/', ctrl.listar);
router.post('/', rulesAgendar, validate, ctrl.agendar);
router.patch('/:id/estado', ctrl.actualizarEstado);

module.exports = router;
