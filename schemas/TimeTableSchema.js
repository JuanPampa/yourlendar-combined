const mongodb = require('mongodb');
const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: false
    },
    date: {
        type: Date,
        trim: true,
        required: true
    },
    /*important: {
        type: Boolean,
        trim: true,
        required: false
    },
    color: {
        type: String,
        trim: true,
        required: false,
        default: 'white'
    },*/
    keyword: {
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
    users: [String]
});

const TimeTable = new mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;