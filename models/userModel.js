const mongoose = require('mongoose');


const userSchema = mongoose.Schema({

    username: String,
    password: String,
    email: String,
    createdAt: String

})

const userModel =  mongoose.model('User',userSchema);

module.exports = userModel;
