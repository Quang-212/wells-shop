const mongoose = require('mongoose');

const User = new mongoose.Schema({
    facebookId: { type: String, default: null },
    googleId: { type: String, default: null },
    provider: { type: String, default: "system" },
    isAdmin: { type: Boolean, default: false },
    displayName: { type: String, required: true },
    profilePhoto: { type: String, default: 'https://thelifetank.com/wp-content/uploads/2018/08/avatar-default-icon.png' },
    email: { type: String, required: true },
    password: { type: String, default: 'OAuth2' },
    cart: { type: Array, default: [] },
    favorites: { type: Array, default: [] },
},
    {
        versionKey: false,
        timestamps: true,
        collection: "users"
    })
User.index({ email: 1 })
module.exports = mongoose.model('User', User, "users")

