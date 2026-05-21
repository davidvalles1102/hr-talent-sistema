const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/vacantes.controller');
const validate = require('../middlewares/validate');

const router = Router();

const rulesCrear = [
  body('titulo').notEmpty().withMessage('El titulo es requerido'),
  body('departamento').notEmpty().withMessage('El departamento es requerido'),
];

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', rulesCrear, validate, ctrl.crear);
router.put('/:id', ctrl.actualizar);

module.exports = router;
