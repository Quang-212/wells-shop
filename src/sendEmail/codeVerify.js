const nodemailer = require('nodemailer')


const codeVerify = async (name, email, code) => {
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
                <h1>Confirm Email</h1>
                <h2>Hello ${name}</h2>
                <p>Thank you for have an account in WELL shop. Here is your verify code: </p>
                <p>${code}</p>
            </div>`,
    })
}

module.exports = codeVerify


