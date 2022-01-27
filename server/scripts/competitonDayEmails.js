require("dotenv").config();
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const compDayMail = require("../mail/competitonDay");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await doc.loadInfo();

  const indivIDSheet = doc.sheetsByTitle["Individual_IDs"];
  const teamIDSheet = doc.sheetsByTitle["Team_IDs"];
  const indivTeamIDSheet = doc.sheetsByTitle["Indiv_Team_IDs"];

  const indivs = await indivIDSheet.getRows();
  const coaches = {};
  indivs.forEach((indiv) => {
    const email = indiv["Coach Email"];
    if (!(email in coaches)) {
      coaches[email] = {
        individuals: [],
        teams: [],
        indiv_teams: [],
        email
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
        teams: [],
        indiv_teams: [],
        email
      };
    }
    coaches[email].teams.push({
      name: team["Name"],
      id: team["ID"],
      students
    });
  });
  let searchID = function (id) {
    let ret = null;
    Object.keys(coaches).forEach((coach) => {
      for (let i = 0; i < coaches[coach].individuals.length; i++) {
        if (coaches[coach].individuals[i].id == id) {
          ret = coaches[coach].email;
        }
      }
    });
    return ret;
  };
  const indiv_teams = await indivTeamIDSheet.getRows();
  indiv_teams.forEach((team) => {
    let students = [];
    let emails = new Set([]);
    for (let n of [
      ["Student 1", "S1 ID"],
      ["Student 2", "S2 ID"],
      ["Student 3", "S3 ID"],
      ["Student 4", "S4 ID"]
    ]) {
      if (team[n[0]] && team[n[0]].length) {
        students.push(team[n[0]]);
        let coach_id = searchID(team[n[1]]);
        if (!emails.has(coach_id)) {
          emails.add(coach_id);
        }
      }
    }
    for (let n of Array.from(emails)) {
      //console.log(JSON.stringify(Array.from(emails)));
      coaches[n].indiv_teams.push({
        name: team["Name"],
        id: team["ID"],
        coaches: Array.from(emails),
        students
      });
    }
  });

  //   console.log(coaches["monaksehgal@gmail.com"].teams);
  Object.keys(coaches).forEach(async (coachID, i) => {
    if (!coachID || !coachID.length) return;
    // if
    console.log(coachID);
    try {
      await compDayMail(coachID, coaches[coachID]);
      //await compDayMail('abu@exeter.edu', coaches[coachID]);
    } catch (err) {
      console.log(err);
    }
    // await compDayMail(coachID, coaches[coachID]);
  });
}

// DONT RUN AGAIN
// run();
