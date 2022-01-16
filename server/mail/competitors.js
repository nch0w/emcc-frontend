const transporter = require("./transporter");

async function competitorMail(emailAddress, teams, individuals) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] Updates and Competitor List",
    text: "",
    html: `
    Dear coaches,
    <br /> <br />

    The EMCC will be occurring on Saturday, January 29th.
    <br /> <br />

    <b>All coaches should read the <a href="https://docs.google.com/document/d/1CpK8lj6GnBWe_u4hrSwX-f51G6McZnWeNR9WwRvdaFA/edit?usp=sharing">competitors protocol</a> and forward it to their teams/individuals. </b> If you will be proctoring the competition, then please carefully read over the <a href="https://docs.google.com/document/d/1PKe0_gteGe8ec5NLU7ruXYjWAmQ-QZjYmEsEzHeFvys/edit?usp=sharing">proctors protocol</a>.
    <br /> <br />

    Furthermore, it is recommended for coaches and participants (and required for all proctors) to join the EMCC discord <a href="https://tinyurl.com/emcc22">here</a>, in order for us to communicate updates, announcements, and information quickly. Members of the Discord server can select a Coach, Proctor, and/or Participant role in the #roles channel.
    <br /> <br />

    Here is your list of registered competitors:
    <br />
    <br />
    <b>Teams:</b> <br /> ${
      teams.length
        ? teams
            .map(
              (team) =>
                `${team.name}: ${[
                  team.student1,
                  team.student2,
                  team.student3,
                  team.student4
                ]
                  .filter((s) => s !== undefined && s.trim().length)
                  .join(", ")}`
            )
            .join("<br />")
        : "None"
    }
    <br />
    <br />
    <b>Individuals:</b> <br /> ${
      individuals.length
        ? individuals.map((indiv) => indiv.student).join("<br />")
        : "None"
    }
    <br />
    <br />
    Please verify that this list is correct. <b> In particular, no student should be registered in multiple teams, or both in a team and as an individual. </b>
    If you need to make any updates, contact <a href="mailto:exetermathclub@gmail.com">exetermathclub@gmail.com</a> (do not reply to this email).
    <br /> <br />

    Sincerely,
    <br /> <br />

    The EMCC team

    <br />
    <br />
    `
  });
}

module.exports = competitorMail;
