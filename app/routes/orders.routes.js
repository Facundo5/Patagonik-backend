const { viewOrders } = require('../controllers/orders.controllers')
const { checkAuth } = require('../middlewares/auth');
const { checkRoleAuth } = require('../middlewares/checkRoleAuth');
const {Router} = require('express');



const router = Router();

router.get('/admin/sales',checkAuth, checkRoleAuth(['admin']), viewOrders);
router.get('/admin/salesonsite',checkAuth, checkRoleAuth(['admin']), viewOrders);


module.exports = router;