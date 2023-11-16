const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const port = 3000
const bodyParser = require('body-parser')
const app = express();
app.set('port', port);
app.use(cors());
app.use(cors({ origin: '*', }));
app.use(express.json());
app.use(morgan("dev"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/api', require('./src/routes/users.routes'));
app.use('/api', require('./src/routes/auth.routes'));
app.use('/api', require('./src/routes/product.routes'));
app.use('/api', require('./src/routes/admin.routes'));
app.use('/api', require('./src/routes/payment.routes'));
app.use('/api', require('./src/routes/orders.routes'));

module.exports = app;