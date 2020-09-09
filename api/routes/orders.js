const express = require('express');
const router  = express.Router();

router.get(`/`, (req, res, next) => {
    const a = 100;
    const b = 200;
    const c = a+b;
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post(`/`, (req, res, next) => {
    const order = {
        my_productID: req.body.productID,
        quantity:req.body.quantity
    }
    res.status(201).json({ // A 201 status code indicates that a request was successful and as a result, a resource has been created
        message: 'Orders was created',
        my_order: order
    });

});

router.get(`/:orderId`, (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId : req.params.orderId
    });
    console.log('*************');
    console.log(req.body);
    console.log('*************');
});

router.delete(`/:orderId`, (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId : req.params.orderId
    });
});

module.exports = router;

