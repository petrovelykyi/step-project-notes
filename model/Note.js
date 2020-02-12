const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
    }
});

module.exports = mongoose.model('Note', noteSchema);