const mongoose = require('mongoose');

// param inside is a schema how my order should look like
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // value here defines a type of data:long string as a serial number
    product_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producttt', // ref is an important key word for connecting to another model. Specify the Name of the model(collection) to connect to
        required: true
    },
    quantity: {
        type : Number,
        default: 1 // we can use it instead of require : true
    }
});

/* now we create a real js object=model(created by given layout) which will have CRUD methods
orderrrs will be a collection name */
module.exports = mongoose.model('Orderrrs', orderSchema);