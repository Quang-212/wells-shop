const Product = require('../models/Product.js')
const cloudinary = require('../ultils/cloudinary.js')


class ProductController {
    //[GET] get all products with pagination
    async getAllWithPagination(req, res, next) {
        const sortQuery = req.query.sort || { createdAt: -1 }
        console.log(sortQuery)
        const search = req.query.search || ''
        const perPage = req.query.perPage || 6
        const pageNum = req.query.page || 1
        try {
            const product = Product.find().find().sort(sortQuery).skip((perPage * pageNum) - perPage).limit(perPage).exec()
            const count = Product.countDocuments().exec()
            const result = await Promise.all([product, count])
            res.status(200).json({
                total: result[1],
                perPage,
                data: result[0],
                sortQuery
            })
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
    async getAll(req, res) {
        if (req.user.isAdmin === false) return res.status(403).json('You are not allow to do this action!')
        try {
            const products = await Product.find().exec()
            res.status(200).json(products)
        } catch (err) {
            res.status(500).json(err)
        }
    }
    // [GET] get one product by ID
    async getOneById(req, res) {
        try {
            if (!req.params.id) return res.status(403).json('You don\'t have ID params on the URL')
            const result = await Product.findById(req.params.id).exec()
            res.status(200).json(result)
        } catch (err) {
            return res.status(500).json(err)
        }
    }
    //[POST] add a new product
    async addProduct(req, res) {
        try {
            const productImage = req.file
            if (req.user.isAdmin === false) return res.status(403).json('You are not allow to do this action!')
            if (!productImage) return res.status(403).json('You don\'t have product image!')
            const productFile = await cloudinary.uploader.upload(
                productImage.path, {
                upload_preset: 'vzbul9lr',
                use_filename: true
            })
            const { secure_url, public_id } = productFile
            const newProduct = new Product({
                ...req.body,
                image: {
                    url: secure_url,
                    id: public_id
                },
                size: JSON.parse(req.body.size)
            })
            const savedProduct = await newProduct.save()
            res.status(201).json(savedProduct)
        } catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = new ProductController
