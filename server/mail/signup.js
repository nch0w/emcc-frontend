const transporter = require("./transporter");

async function signupMail(emailAddress, token, userId) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "✅ [EMCC] Please verify your email address",
    text: `Please verify your email address at ${process.env.SITE_URL}/verify/${token}${userId}.`,
    html: `
    Thanks for creating an account for the Exeter Math Club Competition!
    <br />
    <br />
    Please verify your email address at <a href="${process.env.SITE_URL}/verify/${token}${userId}">${process.env.SITE_URL}/verify/${token}${userId}</a>.
    <br />
    <br />
    If you need help, please message <a href="exetermathclub@gmail.com">exetermathclub@gmail.com</a>.
    `
  });
}

signupMail("alan.bu2016@gmail.com", "a", "a");

module.exports = signupMail;
