const router = require('express').Router()
const contactController = require('../controllers/ContactController')

router.post('/add', contactController.addUserContact)

module.exports = router