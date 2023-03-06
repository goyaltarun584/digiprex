const cron = require('node-cron');
const moment = require('moment');

//Initializing timers for sending notifications
let createdAt_30mins = "0 0 * *";
let createdAt_1day = "0 0 * *";
let createdAt_3day = "0 0 * *";

//Schedulers for sending notifications
let taskForHalfhour = cron.schedule(`${createdAt_30mins} *`, () => {
    console.log('sends notification after 30 minutes');
});
let taskFor_1day = cron.schedule(`${createdAt_1day} *`, () => {
    console.log('sends notification after 1 day');
});
let taskFor_3day = cron.schedule(`${createdAt_3day} *`, () => {
    console.log('sends notification after 3 days');
});


//This map will act as DB for this project.
var productStatus = new Map();

//Function for handling abandoned checkout requests
exports.abandonedCheckout = (req, res, next) => {
    let data = req.body;
    let checkoutCreatedAt = data.created_at;
    createdAt_30mins = moment(checkoutCreatedAt).add(30, 'minutes').format('mm hh DD MM');
    createdAt_1day = moment(checkoutCreatedAt).add(1, 'day').format('mm hh DD MM');
    createdAt_3day = moment(checkoutCreatedAt).add(3, 'days').format('mm hh DD MM');
    let productId = data.id;
    let customerId = data.customer.id;
    productStatus.set(productId, { customerId: customerId, dateTime: checkoutCreatedAt });

    //process of sending notifications starts here
    if (productStatus.has(productId)) {
        taskForHalfhour.start();
        taskFor_1day.start();
        taskFor_3day.start();
    }
    return res.json({ message: 'OK' });
}

//Function for handling order placing requests
exports.orderProduct = (req, res, next) => {
    let productId = req.body.id;
    let customerId = req.body.customer.id;

    //check if product is present in map and same customer is placing order
    if (productStatus.has(productId) && productStatus.get(productId).customerId == customerId) {
        productStatus.delete(productId);
        taskForHalfhour.stop();
        taskFor_1day.stop();
        taskFor_3day.stop();
    }
    res.status(200).send("Order Placed succesfully")
}