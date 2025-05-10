const nodemailer = require("nodemailer");
const ApiError = require("../error/ApiError");

class Nodemailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.NODEMAILER_HOST,
            pool: true,
            port: process.env.NODEMAILER_PORT,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });
    }

    async sendEmail(recipientEmail, emailSubject, emailText){
        const mailOptions = {
            from: `${process.env.NODEMAILER_USER}`,
            to: `${recipientEmail}`,
            subject: `${emailSubject}`,
            text: `${emailText}`
        };

        await this.transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Error while sending email: ' + error);
                return ApiError.internal('Error while sending email ' + error);
            }
        });
    }
}

module.exports = new Nodemailer();