const transporter = require("./transporter");

async function resetPasswordMail(emailAddress, token, userId) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] Password Reset",
    text: `
    A password reset link was requested. Reset your password here: ${process.env.SITE_URL}/newpassword/${token}${userId}

    If you did not request a password reset link, ignore the email and do not share the link with anybody.
    `,
    html: `
    <p>A password reset link was requested. Reset your password here: </p>
    <a href=${process.env.SITE_URL}/newpassword/${token}${userId}>(Click)</a>
    <br/><br/>
    <p>If you did not request a password reset link, please ignore the email and do not share the link with anybody.</p>
    `
  });
}

module.exports = resetPasswordMail;
