const transporter = require("./transporter");

async function indivMail(emailAddress) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] IMPORTANT: Team and Individual Information",
    text: "",
    html: `
    I admit
    `
  });
}

async function run() {
  try {
    await indivMail("bbwang@exeter.edu");
  } catch (err) {
    console.log(err);
  }
}

run();
