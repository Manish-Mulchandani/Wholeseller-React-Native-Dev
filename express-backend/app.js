const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
