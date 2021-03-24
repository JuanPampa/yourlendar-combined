const mongodb = require('mongodb');
const mongoose = require('mongoose');
//let connectionvar = 'mongodb://127.0.0.1:27017/yourlendar';
let connectionvar = "mongodb+srv://juanpampa:4NzadDdEpXAQVlbr@cluster0.5c3ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" || process.env.DATABASE_URI;
// const dotenvExpand = require('dotenv-expand');
// dotenvExpand(require('dotenv').config());

mongoose.connect(connectionvar, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});