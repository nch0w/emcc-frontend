const nodemailer = require("nodemailer");
const aws = require("aws-sdk");

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "exetermathclub@gmail.com",
//     pass: process.env.GMAIL_PASSWORD
//   }
// });

const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: "2010-12-01"
  })
});

module.exports = transporter;
