const router = require('express').Router()
const verifyToken = require('../midlewares/verifyToken.js')
const orderController = require('../controllers/OrderController')

router.post('/add', verifyToken, orderController.addUserOrder)

module.exports = router