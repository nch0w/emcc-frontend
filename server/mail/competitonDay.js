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
    Competition day is in three days, on Jan 29!

    <br /> <br />

    Please share the following information with your teams and individuals before the contest and do not share them with anyone else. They will need it to submit answers:
    <br /> <br />
    ${competitors.teams
      .map(
        (team) =>
          `Team <b>${team.name}</b> consisting of <b>${team.students.join(
            ", "
          )}</b> has Team ID <b>${team.id}</b>.`
      )
      .join("<br />")}
   ${competitors.teams.length ? "<br />" : ""}${
      competitors.teams.length ? "<br />" : ""
    }
   ${competitors.individuals
     .map(
       (indiv) =>
         `Your student <b>${indiv.name}</b> has Individual ID <b>${indiv.id}</b>.`
     )
     .join("<br />")}
    ${competitors.individuals.length ? "<br />" : ""}${
      competitors.individuals.length ? "<br />" : ""
    }
    ${competitors.indiv_teams
      .map(
        (team) =>
          `You have students on Team <b>${
            team.name
          }</b> consisting of <b>${team.students.join(
            ", "
          )}</b> with Team ID <b>${
            team.id
          }</b>. Here are the emails of all coaches with students on this team: <b>${team.coaches.join(
            ", "
          )}</b>. Please reach out to the other coaches. On our discord server there will be a voice channel to facilitate communication between members of an individual team.`
      )
      .join("<br />")}
     ${competitors.indiv_teams.length ? "<br />" : ""}${
      competitors.indiv_teams.length ? "<br />" : ""
    }

    On competition day after the opening ceremony, students should join a zoom meeting with their assigned student leader and proctors. To find a student's assigned zoom room, take the first digit of their student id (e.g. S12345678 -> 1), and find the corresponding zoom link in this google sheet: <a href='https://tinyurl.com/emccproctor'>https://tinyurl.com/emccproctor</a>.</br>

    As a reminder, please join the discord at <a href="https://tinyurl.com/emcc22">https://tinyurl.com/emcc22</a> <br />
    <br />
    Please email exetermathclub@gmail.com with any questions or clarifications. <br />
    <br />
    Good Luck! <br />Exeter Math Club
    `
  });
}

module.exports = indivMail;
