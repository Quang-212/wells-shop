const mongoose = require('mongoose')

const PasswordCode = new mongoose.Schema({
    code: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    expiresAt: { type: Date, default: Date.now() },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'password_code'
})
PasswordCode.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 5 })

module.exports = mongoose.model('PasswordCode', PasswordCode, 'password_code')