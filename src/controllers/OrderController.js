const Order = require('../models/Order.js')

class OrderController {

    async addUserOrder(req, res) {
        try {
            //send email
            if (!req.body) return res.status(403).json('Order is empty')
            const newOrder = new Order(req.body)
            await newOrder.save()
            res.status(201).json('Your order has been created')
        } catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = new OrderController