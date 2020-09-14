const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../../models/productModel');

router.get('/', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });

    // this Model object 'Product' has also: where().limit()
    Product.find() // without param 'find' will return arr of all docs
        .select('name price _id')// only those fields will be fetched from db doc, i do not want "__v"
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                arr_of_products: docs.map( doc => {
                    return {
                        name  : doc.name,
                        price : doc.price,
                        _id   : doc._id,
                        you_can_send_request : {
                            description: 'You can get detailed info about this product',
                            type : 'GET',
                            url  : 'Dynamically fetch to get the id of the service i am running on: http://localhost:3000/products/' + doc._id
                        }
                    };
                })
            };
            // [] will be returned if no records
            if(docs.length > 0){
                res.status(200).json(response);
            }else{
                res.status(404).json({
                    message: 'no entries any more'
                });
            }
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
        .then(doc => {
            res.status(201).json({
                message: 'New product has been created!',
                my_product: {
                    name : doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        description: 'You can get detailed info about this product',
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            });
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
        .select('name price _id')
        .exec() // transform it to a promise
        .then(doc => {
            // We need to check if the doc is not Null
            if(doc){
                console.log(doc);
                res.status(200).json({
                    product: doc,
                    request : {
                        description : 'FOR PUBLIC: You can get all products',
                        type: 'GET',
                        url : 'http://localhost:3000/products'
                    }
                });
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
    const id = req.params.anyVarNameID;

    // we should adjust to any req: with payload as newName only, or both, or with NO payload
    const updatesOperations = {};
    for( const ops of req.body) {// req.body will be an arr with operations, so postman should have a body as an array of objects. propName & value belong to each operation
        updatesOperations[ops.propName] = ops.value;
    }
    // $set is a special property name understood by mongoose
    // Product.update({_id : id}, {$set: { name : req.body.newName, price: req.body.newPrice }});
    Product.update({_id : id}, {$set: updatesOperations})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message : 'Product updated',
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/products/' + id 
                }
            }); 
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                my_message: 'Mongoose error when trying to Update',
                my_error:  err
            });
        });
});

router.delete('/:anyVarNameID', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Deleted product!'
    // });

    // Get id from the URL
    const id = req.params.anyVarNameID;
     
    // object inside should have 1 or more criteria of object to remove
    Product.deleteOne({_id : id})
        .exec()
        .then(result => {
            if(result.deletedCount === 0){
                res.status(404).json({
                    my_message : 'No item to delete'
                });
            }else{
                res.status(200).json({
                    result : result,
                    message :'Product deleted',
                    type : 'POST',
                    url : 'http://localhost:3000/products/',
                    description : 'PUBLIC: you can create another product, by providing this payload:',
                    body : {
                        name : 'String',
                        price : 'Number'
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