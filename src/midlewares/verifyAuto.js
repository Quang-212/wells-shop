const jwt = require('jsonwebtoken')
const Token = require('../models/Token.js')


function verifyAuto(req, res, next){
    const accessToken = req.get('Authorization').split(' ')[1]
    const refreshToken = req.cookies.refreshToken
    if(accessToken && refreshToken){
        jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN_KEY, async(err, user)=>{
        if(err){
            const existToken = await Token.findOne({refreshToken}).exec()
            if(!existToken) return res.status(403).json('Token is not founded')
            jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN_KEY, async (err, user)=>{
                if(err) return res.status(403).json('Refresh token is not valid')
                await Token.findOneAndDelete({refreshToken}).exec()
                const newAccessToken = jwt.sign({id: user.id, isAdmin: user.isAdmin}, process.env.SECRET_ACCESS_TOKEN_KEY, {expiresIn: '10s'})
                const newRefreshToken = jwt.sign({id: user.id, isAdmin: user.isAdmin}, process.env.SECRET_REFRESH_TOKEN_KEY, {expiresIn: '7d'})
                const newToken = new Token({refreshToken: newRefreshToken})
                await newToken.save()
                res
                .status(200)
                .cookie('refreshToken', newRefreshToken)
                .json(newAccessToken) // error need to fixed before use
                next()
            })

        }else{
            next()
        }
    })
    }else{
        return res.status(403).json('You are not allowed to verify auto')
    }
}

module.exports = verifyAuto