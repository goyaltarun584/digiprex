const express = require('express');
const cartController = require('../controllers/cart');

const router = express.Router();

router.post('/addtocart', cartController.abandonedCheckout);
router.post('/orderProduct', cartController.orderProduct);


module.exports = router;