const fs = require('fs');
const nodemailer = require('nodemailer');
let conf = JSON.parse(fs.readFileSync('public/conf.json'));

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    logger: false,
    debug: false,
    auth: {
        user: conf.mailFrom,
        pass: conf.mailSecret,
    }
});

transporter.verify((err, success) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Your node mailer config is correct');
    }
});

const result = {
    send: async (email, subject, text) => {
        try {
            return await transporter.sendMail({
                from: conf.from,
                to: email,
                subject: subject,
                text: text
            })
        } catch (error) {
            console.log("Error sending email:")
            console.log(error);
        }
    },
    test: async () => {
        return transporter.verify();
    }
}

module.exports = result;