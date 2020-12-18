const base = require("airtable").base("appOCNJ0BSbzHwTF3");
const { maxIndivsPerCoach, maxTeamsPerCoach } = require("../config");

async function fetchUser(req, res, next) {
  // get user info with an already valid session token.
  if (req.user) {
    const user = await base("Coaches").find(req.user.id);

    const teams = [];
    const individuals = [];
    const competitors = await base("Competitors")
      .select({
        filterByFormula: `{Coach Email} = '${req.user.fields["Email"]}'`
      })
      .firstPage();

    for (let competitor of competitors) {
      if (competitor.fields.Individual) {
        individuals.push({
          id: competitor.id,
          student: competitor.fields["Student 1"]
        });
      } else {
        teams.push({
          id: competitor.id,
          name: competitor.fields.Name,
          student1: competitor.fields["Student 1"],
          student2: competitor.fields["Student 2"],
          student3: competitor.fields["Student 3"],
          student4: competitor.fields["Student 4"]
        });
      }
    }

    return res.status(200).json({
      coachInfo: {
        name: user.fields["Name"],
        phone: user.fields["Phone"],
        email: user.fields["Email"],
        mail: user.fields["Address"],
        teamLimit: user.teamLimit === -1 ? maxTeamsPerCoach : user.teamLimit,
        indivLimit: user.indivLimit === -1 ? maxIndivsPerCoach : user.indivLimit
      },
      teams,
      individuals
    });
  } else {
    return res.status(400).send("Not logged in.");
  }
}

module.exports = fetchUser;
