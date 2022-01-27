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
    Thank you for your interest in EMCC! 
    Please pass on this message to your students:
    <br /> <br />

    The EMCC will be occurring on Saturday, January 29th.
    <br /> <br />

    <b>All coaches and participants should read the <a href="https://docs.google.com/document/d/1CpK8lj6GnBWe_u4hrSwX-f51G6McZnWeNR9WwRvdaFA/edit?usp=sharing">competitors protocol</a>. </b>
    <br /> <br />

    Furthermore, it is highly recommended for coaches and participants to join the EMCC discord <a href="https://tinyurl.com/emcc22">here</a>, in order for us to communicate updates, announcements, and information quickly. Members of the Discord server can select a Coach and/or Participant role in the #roles channel. Please share this link with your competitors!
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
    If you need to make any updates, please make changes on the website or contact <a href="mailto:exetermathclub@gmail.com">exetermathclub@gmail.com</a> (do not reply to this email).
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
