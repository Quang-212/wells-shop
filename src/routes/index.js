const productRouter = require('./product.js')
const userRouter = require('./user.js')
const authRouter = require('./auth.js')
const contactRouter = require('./contact.js')
const orderRouter = require('./order.js')
const commentRouter = require('./comment.js')

function route(app) {
    app.use('/comment', commentRouter)
    app.use('/product', productRouter)
    app.use('/contact', contactRouter)
    app.use('/order', orderRouter)
    app.use('/user', userRouter)
    app.use('/auth', authRouter)
}

module.exports = route