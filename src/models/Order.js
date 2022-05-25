const mongoose = require('mongoose')

const Order = new mongoose.Schema({
    email: { type: String, required: true},
    recipient: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    postalCode: { type: Number, default: -1 },
    bill: {
        products: { type: Array, required: true, default: [] },
        total: { type: String, required: true, default: 0 }
    }

}, {
    versionKey: false,
    timestamps: true,
    collection: 'orders'
})
Order.index({ email: 1 })

module.exports = mongoose.model('Order', Order, 'orders')