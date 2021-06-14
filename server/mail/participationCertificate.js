const transporter = require("./transporter");
const genCertificate = require("../scripts/generateCertificate");

async function indivMail(emailAddress, competitors) {
  const attachments = await Promise.all(
    competitors.individuals.map(async (indiv) => ({
      filename: `${indiv.name}.pdf`,
      content: Buffer.from(await genCertificate(indiv.name))
    }))
  );

  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] Scores!",
    text: "",
    html: `
    Hello Coaches, 
    <br /> <br />
    We hope your teams enjoyed this year's EMCC. Attached are your participation certificates. We will send certificates for the awards soon. 
    <br /> <br />
    Please email exetermathclub@gmail.com with any questions.
    <br /> <br />
    See you next year! <br />
    Exeter Math Club
    `,
    attachments
  });
}

module.exports = indivMail;
