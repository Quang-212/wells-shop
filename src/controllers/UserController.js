const User = require('../models/User.js')


class UserController {

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.user.id)
            const { password, createdAt, updatedAt, facebookId, googleId, _id, ...info } = user._doc
            res.status(200).json({ id: _id, ...info })
        } catch (err) {
            res.status(500).json(err)
        }
    }
    async updateUser(req, res) {
        try {
            const data = req.body
            if (!data) return res.status(401)('Data can\'t be empty')
            const { username, email, password, profilePicture } = data
            const checkParams = (param) => {
                const element = []
                const dataArray = ['username', 'email', 'password', 'profilePicture']

            }

            const existUser = await User.findByIdAndUpdate({

            }).exec()
            if (!existUser) return res.status(401)('You are not authenticated')


        } catch (err) {

        }
    }
    async favorites(req, res) {
        try {
            await User.findByIdAndUpdate(req.user.id, { favorites: req.body }, { new: true }).exec()
            res.status(200).json('User favorites updated!')
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async cart(req, res) {
        try {
            await User.findByIdAndUpdate(req.user.id, { cart: req.body }, { new: true }).exec()
            res.status(200).json('User cart updated!')
        } catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = new UserController