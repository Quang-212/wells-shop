const mongoose = require('mongoose')

const Token = new mongoose.Schema({
    refreshToken: { type: String, required: true, unique: true },
    expiresAt: { type: Date, default: Date.now() },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'tokens'
})
Token.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 })


module.exports = mongoose.model('Token', Token, 'tokens')