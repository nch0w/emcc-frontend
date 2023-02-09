const transporter = require("./transporter");

async function indivMail(emailAddress, competitors) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] IMPORTANT: Score Report",
    text: "",
    html: `
    Hello Coaches, 
    <br /> <br />
    Thanks to you all for making this year's EMCC a success!

    <br /> <br />

    Here are the score reports for the competition: feel free to share the following information with your teams and individual competitors.
    <br /> <br />
    ${competitors.teams
      .map(
        (team) =>
          `Team <b>${team.name}</b> consisting of <b>${team.students
            .map((student) => student.name)
            .join(", ")}</b> scored <b>${
            team.scores.team
          }</b> in the team round and <b>${
            team.scores.guts
          }</b> in the guts round.`
      )
      .join("<br />")}
   ${competitors.teams.length ? "<br />" : ""}${
      competitors.teams.length ? "<br />" : ""
    }

  ${competitors.teams
    .map((team) =>
      team.students
        .map(
          (student) =>
            `Your student <b>${student.name}</b> scored <b>${student.scores.speed}</b> in the speed round and <b>${student.scores.accuracy}</b> in the accuracy round.`
        )
        .join("<br />")
    )
    .join("<br />")}

  ${competitors.teams.length ? "<br />" : ""}${
      competitors.teams.length ? "<br />" : ""
    }
   ${competitors.individuals
     .map(
       (indiv) =>
         `Your student <b>${indiv.name}</b> scored <b>${indiv.scores.speed}</b> in the speed round, <b>${indiv.scores.accuracy}</b> in the accuracy round, and their team, <b>${indiv.scores.teamName}</b>, scored <b>${indiv.scores.team}</b> in the team round and <b>${indiv.scores.guts}</b> in the guts round.`
     )
     .join("<br />")}

    ${competitors.individuals.length ? "<br />" : ""}${
      competitors.individuals.length ? "<br />" : ""
    }

    <br />

    The 2023 EMCC Problems and Solutions can be found on our website at this link: <a href="https://exetermathclub.com/EMCC_2023_All.pdf">https://exetermathclub.com/EMCC_2023_All.pdf</a>. <br />

    If you have any further questions or concerns, email us at exetermathclub@gmail.com. <br />
    We hope you all enjoyed this year's EMCC and come back next year! <br />

    <br />
    Best, <br />EMCC Team
    `
  });
}

module.exports = indivMail;
