const mongoose = require('mongoose')

const Product = new mongoose.Schema({
    name: { type: String, required: true },
    image: {
        url: { type: String, required: true },
        id: { type: String, required: true }
    },
    price: { type: Number, required: true },
    size: { type: Array, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'products'
})
Product.index({ name: 'text', description: 'text' })
module.exports = mongoose.model('Product', Product)
