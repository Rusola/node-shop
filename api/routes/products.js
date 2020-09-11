const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../../models/productSchema');

router.get('/', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });

    // this Model object 'Product' has also: where().limit()
    Product.find() // without param 'find' will return arr of all docs
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                my_error: err
            });
        });

});

router.post('/', (req, res, next) => {
//   const product = {
//     my_name: req.body.name,
//     my_price: req.body.price
//   };

    // create a new instance of the Product Model to store data. Data for this new model надо положить в виде obj
    const sendable_doc = {
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        price: req.body.price
    };

    // An instance of a model is called a document(here product)?
    const product = new Product(sendable_doc);
    product.save() // storing in DB
        .then(result => {
            res.status(201).json({
                message: 'Handling POST requests to /products',
                my_product: product
            });
            console.log('***********************************---***************');
            console.log(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                my_error : err // IF Anything failed we can se it too
            });
        });

    // res.status(201).json({
    //     message: 'Handling POST requests to /products',
    //     my_product: product
    // });
});

router.get('/:anyVarNameID', (req, res, next) => {
    const id = req.params.anyVarNameID;
    Product.findById(id) // results in a single document by its _id field
        .exec() // transform it to a promise
        .then(doc => {

            // We need to check if the doc is not Null
            if(doc){
                console.log(doc);
                res.status(200).json(doc);
            }else {
                // that is not a program error, just null result
                res.status(404).json({
                    my_message: 'We do not have such id!'
                });
            }
            
        })
        .catch(err => {
            console.log('Invalid id format' + err);
            res.status(500).json({
                my_message: 'Invalid id format',
                my_error: err
            });
        });

    /* Careful! CODE HERE WILL NOT WAIT FOR PROMISE to finish поэтому отправляйте response только внутри then блока (или catch блока if needed)*/
});

router.patch('/:anyVarNameID', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});

router.delete('/:anyVarNameID', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Deleted product!'
    // });

    // Get id from the URL
    const id = req.body.anyVarNameID;
    console.log('***************');
    console.log(id);
    console.log('***************');
    

    // object inside should have 1 or more criteria of object to remove
    Product.remove({name : 'Dary Hoff'})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                mongoose_error: err
            });
            
        });
});

module.exports = router;