const nodemailer = require('nodemailer')


const order = async (name, email, code) => {
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SECRET_EMAIL,
            pass: process.env.SECRET_PASSWORD
        }
    })
    await transport.sendMail({
        from: process.env.SECRET_EMAIL,
        to: email,
        subject: 'Verify WELL Account',
        html:
            `<div>
                <h1>Confirm Order</h1>
                <h2>Hello ${name}</h2>
                <p>Thank you for shopping in WELL shop. Here is your order: </p>
                
            </div>`,
    })
}

module.exports = order


