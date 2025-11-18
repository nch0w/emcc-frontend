const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");
const env = require("../env");

// Configure AWS credentials and region
AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const transporter = nodemailer.createTransport({
  SES: ses
  // or SES: { ses, aws: AWS } if your Nodemailer version wants that,
  // but SES: ses is usually enough
});

module.exports = transporter;
