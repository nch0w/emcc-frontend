require("dotenv").config();
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const compDayMail = require("../mail/competitonDay");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await doc.loadInfo();

  const indivIDSheet = doc.sheetsByIndex[2];
  const teamIDSheet = doc.sheetsByIndex[3];

  const indivs = await indivIDSheet.getRows();
  const coaches = {};
  indivs.forEach((indiv) => {
    const email = indiv["Coach Email"];
    if (!(email in coaches)) {
      coaches[email] = {
        individuals: [],
        teams: []
      };
    }
    coaches[email].individuals.push({
      name: indiv["Student"],
      id: indiv["ID"]
    });
  });

  const teams = await teamIDSheet.getRows();
  teams.forEach((team) => {
    const email = team["Coach Email"];
    let students = [];
    for (let n of ["Student 1", "Student 2", "Student 3", "Student 4"]) {
      if (team[n] && team[n].length) {
        students.push(team[n]);
      }
    }

    if (!(email in coaches)) {
      coaches[email] = {
        individuals: [],
        teams: []
      };
    }
    coaches[email].teams.push({
      name: team["Name"],
      id: team["ID"],
      students
    });
  });

  //   console.log(coaches["monaksehgal@gmail.com"].teams);
  Object.keys(coaches).forEach(async (coachID, i) => {
    if (!coachID || !coachID.length) return;
    if (coachID !== "learning@randommath.com") return;
    // if
    console.log(coachID);
    try {
      await compDayMail(coachID, coaches[coachID]);
    } catch (err) {
      console.log(err);
    }
    // await compDayMail(coachID, coaches[coachID]);
  });
}

// DONT RUN AGAIN
// run();
