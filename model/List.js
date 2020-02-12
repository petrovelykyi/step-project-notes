const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    tasks: {
        type: Array,
        required: false,
    },
    date: {
        type: Date,
    }
});

module.exports = mongoose.model('List', listSchema);