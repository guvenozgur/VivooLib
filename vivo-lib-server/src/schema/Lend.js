const mongoose = require('mongoose');

const lend = new mongoose.Schema({
    lendDate: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    bookId: {
        type: String,
        required: true
    },
    returnDate: {
        type: String,
    },
    isReturned: {
        type: Boolean,
        required: true
    },
    rating: {
        type: Number
    }
});

module.exports = mongoose.model('lend', lend);