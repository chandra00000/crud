var mongo = require('mongoose');
var schema = mongo.Schema({
    _id: mongo.Schema.Types.ObjectId,
    name: String,
    email: String,
    phone: String,
    password: String
})
module.exports = mongo.model('clients', schema);