const Router = require('express');
const { generateLink , statusNotificationMP } = require('../controllers/payment.controller');

const router = Router();

router.post('/payment', generateLink)

router.post('/notification', statusNotificationMP)

router.get('/success', (req, res) =>
    res.send('Todo salio bien'));

module.exports = router;