const mongoose = require('mongoose')

const Contact = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    message: { type: Array, required: true, default: [] }
}, {
    versionKey: false,
    timestamps: true,
    collection: 'contacts'
})

module.exports = mongoose.model('Contact', Contact, 'contacts')