const router = require('express').Router()
const multer = require('multer')
const verifyToken = require('../midlewares/verifyToken.js')
const ProductController = require('../controllers/ProductController.js')

//upload config
const upload = multer({ storage: multer.diskStorage({}) })

// router.post('/add', verifyToken, ProductController.addProduct)
router.post('/add', verifyToken, upload.single('image'), ProductController.addProduct)
router.get('/all', verifyToken, ProductController.getAll)
router.get('/:id', ProductController.getOneById)
router.get('/', ProductController.getAllWithPagination)


module.exports = router