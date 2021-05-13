
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)