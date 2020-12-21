const router = require("express").Router();
const base = require("airtable").base("appOCNJ0BSbzHwTF3");
const updateUser = require("../middleware/updateUser");
const { minTeamMembersPerTeam, maxTeamsPerCoach } = require("../config");

router.post(
  "/update-coach-info",
  async (req, res, next) => {
    if (!req.user)
      return res.status(400).send("Not authenticated. Please login again.");
    const { name, phone, mail } = req.body;
    if (!name || !phone || !mail) {
      return res.status(400).send("Missing coach information");
    }

    try {
      await base("Coaches").update([
        {
          id: req.user.id,
          fields: {
            Name: name,
            Address: mail,
            Phone: phone
          }
        }
      ]);
    } catch (err) {
      return res.status(400).send("Unkown error updating coach info.");
    }
    next();
  },
  updateUser
);

router.post(
  "/update-team",
  async (req, res, next) => {
    // same endpoint fot both adding and updating a team
    // if id is not provided, assume we are adding a team
    const { name, student1, student2, student3, student4, id } = req.body;

    if (!req.user || !req.user.fields["Email Verified"]) {
      return res
        .status(400)
        .send(
          "Email address must be verified before creating teams. Please check your email for a link from exetermathclub@gmail.com, or contact us if you have issues."
        );
    }
    if (!req.user || !req.user.fields.Email || !req.user.fields.Phone) {
      return res
        .status(400)
        .send(
          "Coach email and phone number must be set before creating teams."
        );
    }

    if (!name) {
      return res.status(400).send("Missing team name.");
    }
    let i = 0;
    for (const student of [student1, student2, student3, student4]) {
      if (i >= minTeamMembersPerTeam) break;
      if (!student)
        return res
          .status(400)
          .send(
            "Team member count below minimum allowed (" +
              minTeamMembersPerTeam +
              ")."
          );
      i++;
    }

    try {
      const sameName = await base("Competitors")
        .select({
          filterByFormula: `{Name} = '${name}'`
        })
        .firstPage();

      if (sameName.length > 0 && sameName.id !== id) {
        return res.status(400).send("Team name already in use.");
      }

      const coachTeams = await base("Competitors")
        .select({
          filterByFormula: `{Coach Email} = '${req.user.fields["Email"]}'`
        })
        .firstPage();

      // const teamLimit =
      //   req.user.fields["Team Limit"] < 0
      //     ? maxTeamsPerCoach
      //     : req.user.fields["Team Limit"];

      // if (
      //   coachTeams.filter((team) => !team.fields.Individual).length ==
      //     teamLimit &&
      //   !id
      // ) {
      //   return res.status(400).send("Team limit reached.");
      // }
    } catch (err) {
      console.error(err);
      return res.status(400).send("Internal server error.");
    }

    if (id) {
      try {
        const team = await base("Competitors").find(id);
        if (team.fields.Coach[0] !== req.user.id)
          return res
            .status(400)
            .send("Coach does not have access to this team.");

        await base("Competitors").update([
          {
            id,
            fields: {
              Name: name,
              "Student 1": student1,
              "Student 2": student2,
              "Student 3": student3,
              "Student 4": student4,
              Coach: [req.user.id]
            }
          }
        ]);
        next();
      } catch (err) {
        console.error(err);
        return res.status(400).send("Error updating team.");
      }
    } else {
      try {
        await base("Competitors").create([
          {
            fields: {
              Name: name,
              "Student 1": student1,
              "Student 2": student2,
              "Student 3": student3,
              "Student 4": student4,
              Coach: [req.user.id]
            }
          }
        ]);
        next();
      } catch (err) {
        console.error(err);
        return res.status(400).send("Error creating team.");
      }
    }
  },
  updateUser
);

router.post(
  "/delete-competitor",
  async (req, res, next) => {
    const { id } = req.body;
    if (!req.user) {
      return res.status(400).send("Not authenticated. Please log in again.");
    }
    if (!id) {
      return res.status(400).send("Missing team ID.");
    }
    try {
      const removedTeam = await base("Competitors").find(id);
      if (!removedTeam.fields.Coach.includes(req.user.id))
        return res.status(400).send("Invalid authentication.");

      await base("Competitors").destroy(id);
      next();
    } catch (err) {
      return res.status(400).send("Internal server error.");
    }
  },
  updateUser
);

router.post(
  "/update-indiv",
  async (req, res, next) => {
    const { student } = req.body;

    if (!req.user || !req.user.fields["Email Verified"]) {
      return res
        .status(400)
        .send(
          "Email address must be verified before creating teams. Please check your email for a link from exetermathclub@gmail.com, or contact us if you have issues."
        );
    }
    if (!req.user.fields.Email || !req.user.fields.Phone) {
      return res
        .status(400)
        .send(
          "Coach email and phone number must be set before creating teams."
        );
    }

    if (!student) {
      return res.status(400).send("Missing student name.");
    }

    const coachIndivs = await base("Competitors")
      .select({
        filterByFormula: `AND({Coach} = '${req.user.id}', {Individual})`
      })
      .firstPage();

    if (
      coachIndivs.filter((s) => s.fields["Student 1"] === student).length > 0
    ) {
      return res.status(400).send("Duplicate student.");
    }

    // let indivLimit =
    //   req.user.fields["Individual Limit"] < 0
    //     ? maxTeamsPerCoach
    //     : req.user.fields["Individual Limit"];
    // if (coachIndivs.length == indivLimit) {
    //   return res.status(400).send("Individual limit reached.");
    // }

    try {
      await base("Competitors").create([
        {
          fields: {
            "Student 1": student,
            Coach: [req.user.id],
            Individual: true
          }
        }
      ]);

      next();
    } catch (err) {
      console.error(err);
      return res.status(400).send("Error creating team.");
    }
  },
  updateUser
);

module.exports = router;
