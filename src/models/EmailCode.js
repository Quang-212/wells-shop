const mongoose = require('mongoose')

const EmailCode = new mongoose.Schema({
    code: { type: Number, required: true, default: -1, unique: true },
    email: { type: String, required: true, unique: true },
    expiresAt: { type: Date, default: Date.now() },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'email_code'
})
EmailCode.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 5 })

module.exports = mongoose.model('EmailCode', EmailCode, 'email_code')