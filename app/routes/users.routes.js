const {Router} = require('express');
const { getUsers, editUsers, delUser, getUser, confirm} = require('../controllers/users.controller');
const { checkAuth } = require('../middlewares/auth');
const { checkRoleAuth } = require('../middlewares/checkRoleAuth');


const router = Router();

router.get('/admin/users', checkAuth, checkRoleAuth(['admin']),getUsers);
router.put('/admin/users/:id', checkAuth, checkRoleAuth(['admin']),editUsers);
router.get('/user/confirm/:token', confirm);
//router.put('/:id', editUsers);

//router.delete('/:id', delUserS);

module.exports = router;