const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const User = require('../models/User.js')
const Token = require('../models/Token.js')
const EmailCode = require('../models/EmailCode.js')
const PasswordCode = require('../models/PasswordCode.js')
const codeVerify = require('../sendEmail/codeVerify.js')


class AuthController {

    // [POST] create new user
    async checkUser(req, res) {
        try {
            const existSystemAccount = await User.find({ email: req.body.email }).exec()
            const existUser = existSystemAccount.find(account => account.password !== "OAuth2")
            if (existUser) {
                return res.status(409).json('That email is already in use!')
            }
            const existCode = await EmailCode.findOne({ email: req.body.email }).exec()
            const randomCode = Math.floor(Math.random() * 1000000)
            if (existCode) {
                await EmailCode.findOneAndUpdate({ email: req.body.email }, { code: randomCode }, { new: true }).exec()
                res.status(200).json('Verify email to finish sign up!')
                codeVerify(req.body.displayName, req.body.email, randomCode)
            } else {
                const newEmailCode = new EmailCode({ email: req.body.email, code: randomCode })
                await newEmailCode.save()
                res.status(200).json('Verify email to finish sign up!')
                codeVerify(req.body.displayName, req.body.email, randomCode)
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async sendEmailVerifyCode(req, res) {
        try {
            const email = req.body.email
            const displayName = req.body.displayName
            if (!email || !displayName) return res.status(401).json('Please sign up first')
            const randomCode = Math.floor(Math.random() * 1000000)
            const existCode = await EmailCode.findOneAndUpdate({ email: req.body.email }, { code: randomCode }, { new: true }).exec()
            if (existCode) {
                res.status(200).json('Verify code is sent')
                codeVerify(displayName, email, randomCode)
            } else {
                const newEmailCode = new EmailCode({ email: req.body.email, code: randomCode })
                await newEmailCode.save()
                res.status(200).json('Verify code is sent')
                codeVerify(displayName, email, randomCode)
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async verifyAndRegister(req, res) {
        try {
            const verifyCode = req.body.verifyCode
            if (!verifyCode) return res.status(403).json('Please enter your verify code')
            const existCode = await EmailCode.findOne({ code: verifyCode }).exec()
            if (!existCode) return res.status(403).json('Verification code wrong or expired!')
            const hashPassword = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PASSWORD_KEY).toString()
            const newUser = new User({
                displayName: req.body.displayName,
                password: hashPassword,
                email: req.body.email
            })
            await newUser.save()
            res.status(201).json('Account is created')
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async login(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email, provider: "system" }).exec()
            if (!user) return res.status(401).json('Wrong email or password')
            const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PASSWORD_KEY);
            const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
            if (originalPassword !== req.body.password) return res.status(401).json('Wrong password')
            const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_ACCESS_TOKEN_KEY, { expiresIn: '60s' })
            const refreshToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_REFRESH_TOKEN_KEY, { expiresIn: '7d' })
            const newToken = new Token({ refreshToken })
            await newToken.save()
            const { password, createdAt, updatedAt, cart, favorites, _id, ...info } = user._doc
            res
                .status(200)
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 3600 * 24 * 7,
                    signed: true,
                })
                .json({
                    user: {
                        ...info,
                        id: _id
                    },
                    accessToken
                })
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async refreshToken(req, res) {
        try {
            const refreshToken = req.signedCookies.refreshToken
            if (!refreshToken) return res.status(401).json('You are not authentication!')
            const existRefreshToken = await Token.findOne({ refreshToken })
            if (!existRefreshToken) return res.status(403).json('RefreshToken not found')
            jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN_KEY, async (err, user) => {
                if (err) return res.status(403).json('Refresh token is not valid')
                const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.SECRET_ACCESS_TOKEN_KEY, { expiresIn: '60s' })
                const newRefreshToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.SECRET_REFRESH_TOKEN_KEY, { expiresIn: '7d' })
                await Token.findOneAndUpdate({ refreshToken }, { refreshToken: newRefreshToken }, { new: true }).exec()
                res.status(200)
                    .cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        maxAge: 1000 * 3600 * 24 * 7,
                        signed: true,
                    })
                    .json(accessToken)
            })
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async searchByEmail(req, res) {
        try {
            const email = req.body.email
            if (!email) return res.status(403).json('You are not authenticated!')
            const existUser = await User.findOne({ email, provider: "system" }).exec()
            if (!existUser) return res.status(403).json('User not exist')
            const { displayName, profilePhoto } = existUser._doc
            res.status(200).json({ displayName, profilePhoto, email })
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async sendPasswordVerifyCode(req, res) {
        try {
            const randomCode = Math.floor(Math.random() * 1000000)
            const email = req.body.email
            const displayName = req.body.displayName
            if (email && displayName) {
                const updateVerifyCode = await PasswordCode.findOneAndUpdate({ email }, { code: randomCode }, { new: true })
                if (updateVerifyCode) {
                    codeVerify(displayName, email, randomCode)
                    res.status(200).json('Verify code email is sent')
                } else {
                    const newVerifyCode = new PasswordCode({ code: randomCode, email })
                    await newVerifyCode.save()
                    codeVerify(displayName, email, randomCode)
                    res.status(200).json('Verify code email is sent')
                }
            } else {
                res.status(401).json('You are not authenticated, search your account again!')
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
    async verifyPasswordCode(req, res) {
        try {
            const clientCode = req.body.verifyCode
            if (!clientCode) return res.status(403).json('You are not verified')
            const verify = await PasswordCode.findOne({ code: clientCode }).exec()
            if (!verify) return res.status(403).json('Verification code wrong or expired')
            res.status(200).json('Redirecting to reset password page...')
        } catch (err) {
            res.status(500).json(err)
        }
    }
    async changePassword(req, res) {
        try {
            const isVerified = req.body.isVerified
            const newPassword = req.body.password
            const email = req.body.email
            if (!isVerified) return res.status(403).json('Please verify again!')
            const user = await User.findOne({ email, provider: "system" }).exec()
            const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PASSWORD_KEY);
            const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
            if (newPassword === originalPassword) {
                res.status(403).json('New password same as your current password')
            } else {
                const hashPassword = CryptoJS.AES.encrypt(newPassword, process.env.SECRET_PASSWORD_KEY).toString()
                await User.findByIdAndUpdate(user._id, { password: hashPassword }).exec()
                res.status(200).json('Reset password successful')
            }
        } catch {
            res.status(500).json(err)
        }
    }
    async logout(req, res) {
        const refreshToken = req.signedCookies.refreshToken
        if (!refreshToken) return res.status(403).json('Need have refresh token to logout')
        try {
            await Token.deleteMany({ refreshToken }).exec()
            res
                .status(200)
                .clearCookie('refreshToken')
                .json('Logout successful!')
        } catch (err) {
            res.status(500).json(err)
        }
    }
    async initializeUser(req, res) {
        try {
            if (req.user) {
                const { email, profilePhoto, provider, isAdmin, displayName, id } = req.user
                return res.status(200).json({
                    isLoggedIn: 1,
                    user: {
                        id,
                        displayName,
                        isAdmin,
                        email,
                        profilePhoto,
                        provider
                    }
                })
            }
            const refreshToken = req.signedCookies.refreshToken
            if (!refreshToken) return res.status(200).json({ isLoggedIn: 0 })
            const existToken = await Token.findOne({ refreshToken })
            if (!existToken) return res.status(200).json({ isLoggedIn: 0 })
            jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN_KEY, async (err, info) => {
                if (err) return res.status(200).json({ isLoggedIn: 0 })
                const { id } = info
                const user = await User.findById(id).exec()
                const { email, profilePhoto, provider, isAdmin, displayName, _id } = user._doc
                res.status(200).json({
                    isLoggedIn: 1,
                    user: {
                        id: _id,
                        displayName,
                        isAdmin,
                        email,
                        profilePhoto,
                        provider
                    }
                })
            })
        } catch (err) {
            res.status(500).json(err)
        }
    }

    test(req, res) {
        res.status(200).json('testneeeeeeee')
    }
}
module.exports = new AuthController