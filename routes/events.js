const {Router} = require('express');
const router = Router();
const {check} = require('express-validator');
const {isDate} = require('../helpers/isDate');
const {validarCampos} = require('../middlewares/validar-campos');
const { getEventos, crearEvento, actualizarEvento, elimiarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar.-jwt');

router.use(validarJWT);

router.get('/',getEventos);

router.post('/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatorio').custom(isDate),
        check('end','Fecha de finalización es obligatorio').custom(isDate),
        validarCampos
    ],
crearEvento);

router.put('/:id',actualizarEvento);

router.delete('/:id',elimiarEvento);

module.exports = router;