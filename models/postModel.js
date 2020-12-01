const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

body:String,
username:String,
createdAt:String,
comments:[

    {
        body:String,
        username:String,
        createdAt:String

    }

],
likes: [
    {
        username:String,
        createdAt:String

    }

],
user: {

    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'

}

})

const postModel = mongoose.model('Post',postSchema);

module.exports = postModel;