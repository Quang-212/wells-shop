const jwt = require('jsonwebtoken')
const User = require('../models/User.js')
function verifyToken(req, res, next) {
    const accessToken = req.get('Authorization').split(' ')[1]
    if (req.user) return next()
    if (accessToken) {
        jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN_KEY, async (err, info) => {
            if (err) return res.status(403).json('Token is not valid!')
            const userVerify = await User.findById(info.id).exec()
            if (!userVerify) return res.status(403).json('Undefined user')
            req.user = info
            return next()
        })
    } else {
        return res.status(401).json('You are not authenticated!')
    }
}
module.exports = verifyToken 