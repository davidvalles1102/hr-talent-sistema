const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/evaluaciones.controller');
const validate = require('../middlewares/validate');

const router = Router();

const rulesCrear = [
  body('candidato_id').isInt().withMessage('candidato_id debe ser entero'),
  body('evaluador_id').isInt().withMessage('evaluador_id debe ser entero'),
  body('tipo')
    .isIn(['tecnica', 'actitudinal', 'cultural'])
    .withMessage('Tipo invalido'),
  body('puntaje_tecnico').isFloat({ min: 0, max: 10 }).withMessage('Puntaje tecnico debe ser entre 0 y 10'),
  body('puntaje_actitudinal').isFloat({ min: 0, max: 10 }).withMessage('Puntaje actitudinal debe ser entre 0 y 10'),
  body('puntaje_cultural').isFloat({ min: 0, max: 10 }).withMessage('Puntaje cultural debe ser entre 0 y 10'),
];

router.get('/:candidatoId', ctrl.obtenerPorCandidato);
router.post('/', rulesCrear, validate, ctrl.crear);

module.exports = router;
