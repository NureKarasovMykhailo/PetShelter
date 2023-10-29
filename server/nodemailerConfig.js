const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.ukr.net",
    pool: true,
    port: 465,
    secure: true,
    auth: {
        user: "petshelter04@ukr.net",
        pass: "EyxIid5uFAa2dHpF",
    },
});


module.exports = transporter;