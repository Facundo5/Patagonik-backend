const {Router} = require('express');
const { checkAuth } = require('../middlewares/auth');
const { checkRoleAuth } = require('../middlewares/checkRoleAuth');
const { getCards, delProductdashboard, getDeletedProducts} = require('../controllers/admin.controller')

const router = Router();



router.get('/getcolours');
router.get('/admin-cards', checkAuth, checkRoleAuth(['admin']) , getCards);
router.put('/delete-product-dashboard-administration', delProductdashboard);
router.get('/get-deleted-products',  getDeletedProducts)

module.exports = router;