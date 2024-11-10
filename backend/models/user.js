const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 0
    },
    proposedDares: [String],
    acceptedDares: [String]
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
