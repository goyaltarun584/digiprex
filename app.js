const cartRoutes = require('./routes/cart');
const express = require('express');

const app = express()

app.use(express.json());
app.use('/cart',cartRoutes);

app.listen(3000)
