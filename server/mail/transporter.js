const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
const env = require("../env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "exetermathclub@gmail.com",
    pass: env.GMAIL_PASSWORD
  },
  sendingRate: 1
});

// process.env.AWS_ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID;
// process.env.AWS_SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY;
//const transporter = nodemailer.createTransport({
//  SES: new aws.SES({
//    apiVersion: "2010-12-01"
//    // region: env.AWS_REGION
//  })
//});

module.exports = transporter;
