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
    Competition day is in two days, on Jan 28th!

    <br /> <br />

    Please share the following information with your teams and individuals before the contest and do not share them with anyone else. They will need it to submit answers:
    <br /> <br />
    ${competitors.teams
      .map(
        (team) =>
          `Team <b>${team.name}</b> consisting of <b>${team.students
            .map((student) => student.name)
            .join(", ")}</b> has Team ID <b>${team.id}</b>.`
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
            `Your student <b>${student.name}</b> has Individual ID <b>${student.id}</b>.`
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
         `Your student <b>${indiv.name}</b> has Individual ID <b>${indiv.id}</b>.`
     )
     .join("<br />")}

    ${competitors.individuals.length ? "<br />" : ""}${
      competitors.individuals.length ? "<br />" : ""
    }

    <br />

    When arriving at campus tomorrow, parking will be located behind the Exeter Summer building at 237 Water St, Exeter, NH 03833. <br />
    There will be signs pointing you towards the registration location at the Elting Room in Phillips Hall. <br /> <br />

    The Academy Building, the main hub for the competition, is the main building on campus overlooking the lawn next to Front Street. <br />
    The opening ceremony, along with the Guts Round, will take place in the Assembly Hall, located on the 2nd floor of the Academy Building. <br />
    The individual and team rounds will take place in classrooms in the Academy Building. <br />
    The panels and closing ceremony will occur in the Forum, located on the 3rd floor of the Elizabeth Phillips Academy Center (EPAC). <br />
    EPAC is located on the opposite side of the Academy Building from Front Street, and is the first building on the left when driving down Tan Lane. <br />
    Opposite the lawn adjacent to EPAC is Phillips Hall. The Elting Room is located on the first floor of Phillips Hall, and registration will take place in the Elting Room. <br /> <br />
    A campus map can be found at <a href="https://exeter.edu/about-us/our-campus">exeter.edu/about-us/our-campus.</a> <br />

    Please email exetermathclub@gmail.com with any questions or clarifications. <br />
    <br />
    Good Luck! <br />EMCC Team
    `
  });
}

module.exports = indivMail;
