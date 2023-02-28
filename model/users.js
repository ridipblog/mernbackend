const mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    phone: String,
    work: String,
    password: String,
    message:[String]
}, { collection: 'users' });
module.exports = mongoose.model('users', userSchema);