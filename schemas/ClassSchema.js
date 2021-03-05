const mongodb = require('mongodb');
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    teacher: {
        username: {
            type: String,
            trim: true,
            required: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        }
    },
    users: [{
        name: {
            type: String,
            trim: true,
            required: true
        },
        surname: {
            type: String,
            trim: true,
            required: true
        },
        username: {
            type: String,
            trim: true,
            required: true
        }
    }]
});

const ClassItem = new mongoose.model('classes', classSchema);

module.exports = ClassItem;