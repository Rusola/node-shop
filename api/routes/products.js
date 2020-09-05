const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    })
});

router.post('/', (req, res, next) => {
    const product = {
        my_name: req.body.name,
        my_price: req.body.price
    }
    res.status(201).json({
        message: 'Handling POST requests to /products',
        my_product: product
    })
});

router.get('/:anyVarNameID', (req, res, next) => {
    const id = req.params.anyVarNameID;
    if(id ==='special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed ID'
        })
    }
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