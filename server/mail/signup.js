const transporter = require("./transporter");

async function signupMail(emailAddress, token, userId) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <exetermathclub@gmail.com>',
    to: emailAddress,
    subject: "✅ [EMCC] Please verify your email address",
    text: `Please verify your email address at https://exetermathclub.com/verify/${token}${userId}.`,
    html: `
    Thanks for creating an account for the Exeter Math Club Competition! 
    <br />
    Please verify your email address at <a href="https://exetermathclub.com/verify/${token}${userId}">https://exetermathclub.com/verify/${token}${userId}</a>.`
  });
}

module.exports = signupMail;
