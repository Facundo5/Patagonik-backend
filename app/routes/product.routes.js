const { addProduct, getProduct,updateProduct,delProduct, getProducts, getProductsAdmin, delProductAdmin, acceptProductAdmin} = require('../controllers/product.controller');
const {Router} = require('express');
const { checkAuth } = require('../middlewares/auth');
const { checkRoleAuth } = require('../middlewares/checkRoleAuth');
const upload = require('../utils/multer')
const { generateLink } = require('../controllers/payment.controller');

const router = Router();


router.get('/get-product/:product', getProduct, generateLink)
router.get('/get-products', getProducts)
router.get('/admin/viewproducts', checkAuth, checkRoleAuth(['admin']) , getProducts)
router.put('/admin/updateproduct/:id',checkAuth, checkRoleAuth(['admin']) , updateProduct);
router.post('/admin/addproduct', checkAuth, checkRoleAuth(['admin']) ,upload.array("images"),addProduct);
// router.delete('/admin/delproduct/:id_shoes',checkAuth, checkRoleAuth(['admin']) , delProduct);
router.get('/get-products-admin', getProductsAdmin);
router.put('/del-product-admin', delProductAdmin);
router.put('/accept-product-admin', acceptProductAdmin);

module.exports = router;