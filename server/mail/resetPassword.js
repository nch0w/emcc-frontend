const transporter = require("./transporter");

async function resetPasswordMail(emailAddress, token, userId) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] Password Reset",
    text: `buhbuhbuh`,
    html: `
    A password reset link was requested. Reset your password here: ${process.env.SITE_URL}/newpassword/${token}${userId}.
    <br/><br/>
    If you did not request a password reset link, ignore the email and do not share the link with anybody.
    `
  });
}

module.exports = resetPasswordMail;
