const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    items: [{
        itemId: {
            type: String
        },
        price: {
            type: Number
        }
    }]
},{versionKey: false, timestamps: true});

module.exports = mongoose.model('User',userSchema);