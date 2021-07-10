const transporter = require("./transporter");
const { genAwardCertificate } = require("../scripts/generateCertificate");

async function indivMail(emailAddress, awardList) {
  if (!awardList.length) {
    console.log("No awards for " + emailAddress);
    return;
  }

  const attachments = await Promise.all(
    awardList.map(async (competitor) => ({
      filename: `${competitor.name} - ${competitor.shortAward}.pdf`,
      content: Buffer.from(
        await genAwardCertificate(competitor.name, competitor.award)
      )
    }))
  );

  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] Award Certificates!",
    text: "",
    html: `
    Hello Coaches, 
    <br /> <br />
    Attached are your award certificates; apologies for the delay. Congrats on your accomplishments! 
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
