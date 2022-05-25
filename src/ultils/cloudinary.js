const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.UPLOAD_CLOUD_NAME,
    api_key: process.env.UPLOAD_API_KEY,
    api_secret: process.env.UPLOAD_API_SECRET
})

module.exports = cloudinary