const base = require("airtable").base("appLfWD5To0qamuRu");
const { maxIndivsPerCoach, maxTeamsPerCoach } = require("../config");

async function updateUser(req, res, next) {
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
    const indivResults = [];
    const teamResults = [];
    const teamsToCheck = []; // we want to figure out which teams the coach has their business meddling in (don't want to show results to the wrong person)
    const ownedCompetitors = await base("Individual Results")
      .select({
        filterByFormula: `{Coach Email} = '${req.user.fields["Email"]}'`
      })
      .firstPage();
    for (let competitorResult of ownedCompetitors) {
      if (competitorResult.fields["Speed Rank"]) {
        indivResults.push({
          name: competitorResult.fields["Individual"],
          speedRank: competitorResult.fields["Speed Rank"],
          accuracyRank: competitorResult.fields["Accuracy Rank"],
          overallRank: competitorResult.fields["Overall Rank"],
          speedScore: competitorResult.fields["Speed Score"],
          accuracyScore: competitorResult.fields["Accuracy Score"],
          overallScore: competitorResult.fields["Overall Score"],
          speedDistribution: competitorResult.fields["Speed Distribution"],
          accuracyDistribution: competitorResult.fields["Accuracy Distribution"]
        });
      }
      teamsToCheck.push(competitorResult.fields["Team Name"]);
    }
    var ownedTeams = new Set(teamsToCheck); // delete duplicates
    var teamResult;
    for (let ownedTeamName of ownedTeams) {
      teamResult = await base("Team Results")
        .select({
          filterByFormula: `{Team Name} = '${ownedTeamName}'`
        })
        .firstPage();
      if (teamResult.length !== 0) {
        //if for some reason no team is associated in the airtable? maybe like a whole ass team was registered but didnt show up or something idk
        teamResults.push({
          name: teamResult[0].fields["Team Name"],
          teamRank: teamResult[0].fields["Team Rank"],
          teamScore: teamResult[0].fields["Team Score"],
          teamDistribution: teamResult[0].fields["Team Distribution"],
          gutsRank: teamResult[0].fields["Guts Rank"],
          gutsScore: teamResult[0].fields["Guts Score"],
          gutsDistribution: teamResult[0].fields["Guts Distribution"],
          gutsEstimation: teamResult[0].fields["Guts Estimation Scores"],
          individualsCumulative: teamResult[0].fields["Individuals Cumulative"],
          sweepsRank: teamResult[0].fields["Sweeps Rank"],
          sweepsScore: teamResult[0].fields["Sweeps Score"]
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
      individuals,
      indivResults,
      teamResults
    });
  } else {
    return res.status(400).send("Not logged in.");
  }
}

module.exports = updateUser;
