const Contact = require('../models/Contact')

class ContactController {
    
    async addUserContact(req, res) {
        try {
            if (!req.body.email) return res.status(401).json('You are not authenticated')
            const existContact = await Contact.findOneAndUpdate({ email: req.body.email }, { $addToSet: { message: req.body.message } }, { new: true })
            if (!existContact) {
                const newContact = new Contact(req.body)
                await newContact.save()
                res.status(201).json(newContact)
            } else {
                res.status(200).json(existContact)
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = new ContactController