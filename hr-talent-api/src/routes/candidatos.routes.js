const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/candidatos.controller');
const validate = require('../middlewares/validate');

const router = Router();

const rulesCrear = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('email').isEmail().withMessage('Email invalido'),
  body('puesto_interes').notEmpty().withMessage('El puesto de interes es requerido'),
];

const rulesActualizar = [
  body('email').optional().isEmail().withMessage('Email invalido'),
  body('estado')
    .optional()
    .isIn(['activo', 'en_proceso', 'contratado', 'descartado'])
    .withMessage('Estado invalido'),
];

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', rulesCrear, validate, ctrl.crear);
router.put('/:id', rulesActualizar, validate, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
