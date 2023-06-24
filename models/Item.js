const mongoose = require('mongoose');
const schema = mongoose.Schema;

const itemSchema = new schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    starting_price: {
        type: Number
    },
    image: {
        type: String
    },
    itemId : String,
    lastBid: {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        bid: Number,
        default: {}
    },
    available: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Item', itemSchema);