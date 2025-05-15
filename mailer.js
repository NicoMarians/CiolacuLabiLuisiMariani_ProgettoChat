const fs = require('fs');
const nodemailer = require('nodemailer');
let conf = JSON.parse(fs.readFileSync('public/conf.json'));

const transporter = nodemailer.createTransport({
    host: "smtp.ionos.it",
    port: 587,
    secure: false,
    logger: false,
    debug: false,
    auth: {
        user: conf.email.mailFrom,
        pass: conf.email.mailSecret,
    }
});

transporter.verify((err, success) => {
    if (err) {
        console.error(err);
    } else {
    }
});

const result = {
    send: async (email, subject, text) => {
        try {
            return await transporter.sendMail({
                from: conf.email.mailFrom,
                to: email,
                subject: subject,
                text: text
            })
        } catch (error) {
            console.log(error);
        }
    },
    test: async () => {
        return transporter.verify();
    }
}

module.exports = result;


//result.send("ciolacutommaso@itis-molinari.eu", "PROVA", "QUESTA è UNA PROVA")