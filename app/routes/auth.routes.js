const { Router, query } = require('express');
const { userLogin, userRegister} = require('./../controllers/auth.controller');
const {validarCampo} = require('../middlewares/validar-campos');


const router = Router();

router.post('/login',userLogin);
router.post('/register',userRegister);
router.post('user/confirm/:token',);


module.exports = router;