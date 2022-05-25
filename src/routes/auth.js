const router = require('express').Router()
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User.js')
const authController = require('../controllers/AuthController.js')
const verifyToken = require('../midlewares/verifyToken.js')

//handle passport common
passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    try {
        const existFbUser = await User.findById(id).exec()
        const { _id, ...info } = existFbUser._doc
        done(null, { id: _id, ...info })
    } catch (err) {
        done(null, err)
    }
})
// passport facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.SECRET_SERVER_DOMAIN}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email']
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const { id, name, picture: { data: { url } }, email } = profile._json
            const existFbUser = await User.findOne({ facebookId: id }).exec()
            if (existFbUser) {
                return done(null, existFbUser)
            } else {
                const newFbUser = new User({
                    facebookId: id.toString(),
                    displayName: name,
                    profilePhoto: url,
                    email,
                    provider: 'facebook',
                })
                const savedUser = await newFbUser.save()
                return done(null, savedUser)
            }
        } catch (err) {
            return done(null, err)
        }
    }
))
router.get('/facebook',
    passport.authenticate('facebook', { authType: "rerequest", scope: ['email'] }))
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/auth/passport/login/failed'
    }))

// passport google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: `${process.env.SECRET_SERVER_DOMAIN}/auth/google/callback`,
},
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const { sub, name, picture, email } = profile._json
            const existGGUser = await User.findOne({ googleId: sub }).exec()
            if (existGGUser) {
                return done(null, existGGUser)
            } else {
                const newGGUser = new User({
                    googleId: sub.toString(),
                    displayName: name,
                    profilePhoto: picture,
                    email,
                    provider: 'google',
                })
                const savedUser = await newGGUser.save()
                return done(null, savedUser)
            }
        } catch (err) {
            return done(null, err)
        }
    }
))

router.get('/google',
    passport.authenticate('google', { authType: "rerequest", scope: ['profile', 'email'] }))
router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: "/",
        failureRedirect: '/auth/passport/login/failed'
    }))

router.get('/passport/logout', (req, res) => {
    req.logout()
    res.redirect('/shop')
})
router.get("/passport/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "---user failed to authenticate---"
    })
})
//system auth
router.post('/check-user', authController.checkUser)
router.post('/send-verify-code', authController.sendEmailVerifyCode)
router.post('/verify-and-register', authController.verifyAndRegister)
router.post('/login', authController.login)
router.post('/refreshToken', authController.refreshToken)
router.post('/recover/search', authController.searchByEmail)
router.post('/recover/send', authController.sendPasswordVerifyCode)
router.post('/recover/verify', authController.verifyPasswordCode)
router.post('/recover/change-password', authController.changePassword)
router.post('/logout', authController.logout)
router.get('/initialize-user', authController.initializeUser)
router.get('/test', verifyToken, authController.test)


module.exports = router