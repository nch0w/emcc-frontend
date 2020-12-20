require("dotenv").config();

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "exetermathclub@gmail.com",
    pass: process.env.GMAIL_PASSWORD
  }
});

module.exports = transporter;
