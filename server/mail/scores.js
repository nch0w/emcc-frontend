const transporter = require("./transporter");

async function indivMail(emailAddress, competitors) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] Scores!",
    text: "",
    html: `
    Hello Coaches, 
    <br /> <br />
    Thanks for all your help proctoring the EMCC, we appreciate it! We hope your teams enjoyed this year's EMCC. If they did, please feel free to come again next year to the 2022 EMCC, where we hope students will be able to come and enjoy our campus once again.
    <br /> <br />
    <b> Team Results </b>
    <br /> <br />
    ${competitors.teams
      .map(
        (team) =>
          `Team <b>${team.name}</b> consisting of ${team.students.join(
            ", "
          )} scored ${team.score.team}/300 on the team round, and scored ${
            team.score.guts1
          }/18, ${team.score.guts2}/21, ${team.score.guts3}/27, ${
            team.score.guts4
          }/33, ${team.score.guts5}/39, ${team.score.guts6}/45, ${
            team.score.guts7
          }/54, and ${
            team.score.guts8
          }/63 on each of sets 1-8 of the guts round.`
      )
      .join("<br />")}
          <br />
      ${competitors.indiv_teams
        .map(
          (team) =>
            `Team <b>${team.name}</b> consisting of ${team.students.join(
              ", "
            )} scored ${team.score.team}/300 on the team round, and scored ${
              team.score.guts1
            }/18, ${team.score.guts2}/21, ${team.score.guts3}/27, ${
              team.score.guts4
            }/33, ${team.score.guts5}/39, ${team.score.guts6}/45, ${
              team.score.guts7
            }/54, and ${
              team.score.guts8
            }/63 on each of sets 1-8 of the guts round.`
        )
        .join("<br />")}
    <br /> <br />
    <b> Individual Results </b>
    <br /> <br />
    ${competitors.individuals
      .map(
        (indiv) =>
          `<b>${indiv.name}</b> scored ${indiv.score.speed}/60 on speed and ${indiv.score.accuracy}/90 on accuracy, for an individual sweepstakes of ${indiv.score.combined}/150.`
      )
      .join("<br />")}
    <br /> <br />
    ${competitors.teams
      .map(
        (team) =>
          `Team <b>${team.name}</b> scored ${team.score.combined} in team sweepstakes.`
      )
      .join("<br />")}
      <br />
      ${competitors.indiv_teams
        .map(
          (team) =>
            `Team <b>${team.name}</b> scored ${team.score.combined} in team sweepstakes.`
        )
        .join("<br />")}
    <br /> <br />
    Please email exetermathclub@gmail.com with any questions.
    <br /> <br />
    See you next year! <br />
    Exeter Math Club
    `
  });
}

module.exports = indivMail;
