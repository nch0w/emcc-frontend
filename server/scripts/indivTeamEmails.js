require("dotenv").config();
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const indivTeamMail = require("../mail/indivTeam");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await doc.loadInfo();

  const indivTeamIDSheet = doc.sheetsByIndex[4];

  const indiv_teams = await indivTeamIDSheet.getRows();
  indiv_teams.forEach(async (team, i) => {
    // if (i !== 0) return;
    let email = team["Coach Emails"].split("; ");
    email = email.filter((m) => m.length);
    const id = team["ID"];
    let students = [];
    for (let n of ["Student 1", "Student 2", "Student 3", "Student 4"]) {
      if (team[n] && team[n].length) {
        students.push(team[n]);
      }
    }
    const zoom_link = team["Zoom link"];
    const name = team["Name"];
    console.log(name);
    await indivTeamMail(email, id, students, name, zoom_link);
    // await(record.fields.Email, teams, individuals);
  });
}

// DONT RUN AGAIN
// run();
