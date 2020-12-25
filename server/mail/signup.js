const transporter = require("./transporter");

async function signupMail(emailAddress, token, userId) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <exetermathclub@gmail.com>',
    to: emailAddress,
    subject: "✅ [EMCC] Please verify your email address",
    text: `Please verify your email address at ${process.env.SITE_URL}/verify/${token}${userId}.`,
    html: `
    Thanks for creating an account for the Exeter Math Club Competition! 
    <br />
    Please verify your email address at <a href="${process.env.SITE_URL}/verify/${token}${userId}">${process.env.SITE_URL}/verify/${token}${userId}</a>.`
  });
}

module.exports = signupMail;