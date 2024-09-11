import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
    }
}

/*
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5c53f105ba51aa",
    pass: "0e084814a66c56"
  }
});
*/

export const transporter = nodemailer.createTransport(config());