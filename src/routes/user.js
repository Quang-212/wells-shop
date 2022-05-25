const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController.js')
const verifyToken = require('../midlewares/verifyToken.js')

router.get('/:id', verifyToken, userController.getUserById)
router.post('/personal-favorites', verifyToken, userController.favorites)
router.post('/personal-cart', verifyToken, userController.cart)
module.exports = router