const mongoose = require('mongoose');

const book = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    authors: {
        type: Array
    },
    publisher: {
        type: String
    },
    publishedDate: {
        type: String
    },
    pageCount: {
        type: String
    },
    categories: {
        type: Array
    },
    averageRating: {
        type: Number
    },
    ratingCount: {
        type: Number
    },
    language: {
        type: String
    },
    status: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('book', book);