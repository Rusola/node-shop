const mongoose = require('mongoose');

// param inside is a schema how my product should look like
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // value here defines a type of data:long string as a serial number
    name : {
        type: String,
        required : true
    },
    price: {
        type: Number,
        required : true
    }
});

/* now we create a real js object=model(created by given layout) which will have CRUD methods
Producttt will be a collection name */
module.exports = mongoose.model('Producttt', productSchema);