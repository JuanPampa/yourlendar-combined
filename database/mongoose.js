const mongodb = require('mongodb');
const mongoose = require('mongoose');
//let connectionvar = 'mongodb://127.0.0.1:27017/yourlendar';
let connectionvar = process.env.DATABASE_URI;
// const dotenvExpand = require('dotenv-expand');
// dotenvExpand(require('dotenv').config());

mongoose.connect(connectionvar, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});