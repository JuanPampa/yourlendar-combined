const mongodb = require('mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    // Array that will store all the user tokens.
    tokens: [{
        yourlendartoken: {
            type: String,
            required: true,
            trim: true,
        }
    }],
    entusername: {
        type: String,
        required: false,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    codepin: {
        type: Number,
        minlength: 4,
        maxlength: 4,
        required: false
    },
    teacher: {
        type: Boolean,
        required: true
    }
});

userSchema.statics.generateUserToken = async (username) => {
    const userToken = await jwt.sign({data: username}, 'yourlendarapi', {expiresIn: '7d'});
    return userToken;
}

/* 
Creating a User model so that the user can create new users, based on
this schema, that are going to be stored in the database.
*/
const User = new mongoose.model('User', userSchema);

module.exports = User;