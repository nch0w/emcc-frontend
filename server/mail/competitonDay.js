const transporter = require("./transporter");

async function indivMail(emailAddress, competitors) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] IMPORTANT: Team and Individual Information",
    text: "",
    html: `
    Hello Coaches, 
    <br /> <br />
    Competition day is tomorrow, Feb 20!

    <br /> <br />

    Please share the following information with your teams and individuals before the contest. They will need it to submit answers:
    <br /> <br />
    ${competitors.teams
      .map(
        (team) =>
          `Team ${team.name} consisting of ${team.students.join(
            ", "
          )} has Team ID ${team.id}.`
      )
      .join("<br />")}
   <br /><br />
   ${competitors.individuals
     .map(
       (indiv) => `Your student ${indiv.name} has Individual ID ${indiv.id}.`
     )
     .join("<br />")}
    <br /><br />

    The opening ceremony will be held on <b> February 20th</b> at <b> 10:00 AM, EST. </b> The zoom link for the opening ceremony is: https://exeter.zoom.us/j/93208198357 <br />
    <br />

    The schedule for the entire day can be found at exetermathclub.com/contest. <br /><br />The zoom link for the Student Panel is: https://exeter.zoom.us/j/97754808349<br /><br />
    The zoom link for the Closing Ceremony is: https://exeter.zoom.us/j/99735131880<br /><br />The zoom link where your team will be proctored can be found on <a href="https://docs.google.com/spreadsheets/d/1D7Xwo4-RN39PC7A0o92mHQ-CQg-9Dm2XdhBiDrD2gAE/edit#gid=914552807">this sheet</a>. All students must join this zoom meeting <b> by 11:00 AM EST. </b>
    <br /><br />
    As a reminder, please join the discord at https://discord.gg/RCafkSRw <br />
    <br />
    Please email exetermathclub@gmail.com with any questions or clarifications. <br />
    <br />
    Good Luck! <br />Exeter Math Club
    `
  });
}

module.exports = indivMail;
