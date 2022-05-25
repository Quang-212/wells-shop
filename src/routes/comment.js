const router = require('express').Router()
const commentController = require('../controllers/CommentController')

router.post('/product', commentController.addProductComment)
router.get('/product/root/:productId', commentController.getRootComment)
router.get('/product/child/:commentId', commentController.getChildrenComment)

module.exports = router