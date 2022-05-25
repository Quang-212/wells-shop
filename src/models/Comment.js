const mongoose = require('mongoose')
const { Schema } = mongoose

const Comment = Schema({
    targetId: { type: String, required: true },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    reply: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    versionKey: false,
    timestamps: true,
    collection: 'comments'
})

module.exports = mongoose.model('Comment', Comment, 'comments')