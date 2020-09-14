const express = require('express');
const mongoose = require('mongoose'); // in order to create an order _id
const Order = require('../../models/orderModel');
const Product = require ('../../models/productModel');
const router = express.Router();

router.get('/', (req, res, next) => {
    Order
        .find() // find an arr of all docs(orders)
        .select('_id product_id quantity') // filter a db doc properties
        .populate('product_id')// add info about doc that tight by the name of my reference property
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product_id: doc.product_id,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            description: 'Public,you can get an order details',
                            url : 'http://localhost:3000/orders/' + doc._id
                        }
                    };
                }),
              
            });
        })
        .catch(err => {
            res.status(500).json({
                mongoose_error: err 
            });
        });
});

router.post('/', (req, res, next) => {
    // Make sure that we can not create orders for products that we do not have
    Product.findById(req.body.productId)
        .then(product => {// if that succeeds then do POST
            if(!product){// it will not be an error if not found, but null
                return res.status(404).json({// !!! MUST RETURN HERE!!! SO NO subsequent code to be executed 
                    message: 'Product can not be ordered as not found'
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(), // will generate a new id for an order
                product_id : req.body.productId,
                quantity: req.body.passed_quantity
            });
            return order.save(); // will give us a real promise no need to exec()
        })// чтобы не делать асинхронное сохрание внутри асинхронного поиска разделим их на 2 отдельных promise
        .then(doc => {
            res.status(201).json({
                message: 'Order stored',
                created_order: {
                    _id : doc._id,
                    product_id: doc.product_id,
                    quantity: doc.quantity
                },
                request: {
                    type: 'GET',
                    description: 'Public,you can get an order details',
                    url : 'http://localhost:3000/orders/' + doc._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                msg: 'We do not have such product',
                error: err
            });
        });

   
    // res.status(201).json({ // 201 resource has been created
    //     message: 'Orders was created',
    //     my_order: order
    // });

});

router.get('/:orderId', (req, res, next) => {
    // Get id from the URL
    Order.findById(req.params.orderId) //see name on line 84
        .populate('product_id', 'name product_id')// name of my reference property & properties that need to be fetched from there
        .exec()
        .then(order => {
            if(!order){
                return res.status(404).json({
                    message: 'Not existing order id specified'
                });
            }else{
                res.status(200).json({
                    my_order: order,
                    request : {
                        type : 'GET',
                        description: 'Public, you can see orders',
                        url : 'http://localhost:3000/orders'
                    }
                });

            }
        })
        .catch(err => {
            res.status(500).json({
                mongoose_error: err 
            });
        });

    // res.status(200).json({
    //     message: 'Order details',
    //     orderId: req.params.orderId
    // });
});

router.delete('/:orderId', (req, res, next) => {
    // Get id from the URL
    const id = req.params.orderId;
     
    // object inside should have 1 or more criteria of object to remove
    Order.deleteOne({_id : id})
        .exec()
        .then(result => {
            if(result.deletedCount === 0){
                res.status(404).json({
                    my_message : 'No item to delete'
                });
            }else{
                res.status(200).json({
                    result : result,
                    message :'your Order deleted',
                    type : 'POST',
                    url : 'http://localhost:3000/orders/',
                    description : 'PUBLIC: you can create another order, by providing this payload:',
                    body : {
                        product_id : 'String',
                        quantity : 'Number'
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                mongoose_error: err
            });
            
        });
});

module.exports = router;

