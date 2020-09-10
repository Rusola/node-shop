const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../../models/productSchema');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
//   const product = {
//     my_name: req.body.name,
//     my_price: req.body.price
//   };

    // create a new instance of the Product Model to store data. Data for this new model надо положить в виде obj
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        price: req.body.price
    });
    product
        .save() // storing in DB, .exec() will turn it into promise
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));

    res.status(201).json({
        message: 'Handling POST requests to /products',
        my_product: product
    });
});

router.get('/:anyVarNameID', (req, res, next) => {
    const id = req.params.anyVarNameID;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                my_error: err
            });
        });

    /* Careful! CODE HERE WILL NOT WAIT FOR PROMISE to finish поэтому отправляйте response только внутри then блока (или catch блока if needed)*/

//   if(id ==='special'){
//     res.status(200).json({
//       message: 'You discovered the special ID',
//       id: id
//     });
//   } else {
//     res.status(200).json({
//       message: 'You passed ID'
//     });
//   }
});

router.patch('/:anyVarNameID', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});

router.delete('/:anyVarNameID', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product!'
    });
});

module.exports = router;