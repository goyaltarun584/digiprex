var cron = require('node-cron');
var moment = require('moment');

let createdAt_30mins= "0 0 * *";
let createdAt_1day= "0 0 * *";
let createdAt_3day= "0 0 * *";

let taskForHalfhour = cron.schedule(`${createdAt_30mins} *`, () => {
    console.log('sends notification after 30 minutes');
});
let taskFor_1day = cron.schedule(`${createdAt_1day} *`, () => {
    console.log('sends notification after 1 day');
});
let taskFor_3day = cron.schedule(`${createdAt_3day} *`, () => {
    console.log('sends notification after 3 days');
});

var productStatus = new Map();

exports.addToCart = (req, res, next) => {
    let data = req.body;
    let createdAt = data.created_at;
    // let createdAt = d.toJSON().slice(0, 19).replace('T', ':');
    createdAt_30mins = moment(createdAt).add(30,'minutes').format('mm hh DD MM');
    createdAt_1day = moment(createdAt).add(1,'day').format('mm hh DD MM');
    createdAt_3day = moment(createdAt).add(3,'days').format('mm hh DD MM');
    let productId = data.id;
    let customerId = data.customer.id;
    productStatus.set(productId, {customerId:customerId,dateTime: createdAt});
    //process of sending notifications starts here
    if (productStatus.has(productId)) {
        taskForHalfhour.start();
        taskFor_1day.start();
        taskFor_3day.start();
    }
    return res.json({ message: 'OK' });
}

exports.orderProduct = (req, res, next) => {
    let productId = req.body.id;
    let customerId = req.body.customer.id;
    if (productStatus.has(productId) && productStatus.get(productId).customerId == customerId) {
        productStatus.delete(productId);
        taskForHalfhour.stop();
        taskFor_1day.stop();
        taskFor_3day.stop();
    }
    res.status(200).send("Order Placed succesfully")

}