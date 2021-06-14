require("dotenv").config();
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const scoresMail = require("../mail/scores");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await doc.loadInfo();

  const indivIDSheet = doc.sheetsByIndex[2];
  const teamIDSheet = doc.sheetsByIndex[3];
  const indivTeamIDSheet = doc.sheetsByIndex[4];

  const indivs = await indivIDSheet.getRows();
  const coaches = {};
  indivs.forEach((indiv) => {
    const email = indiv["Coach Email"];
    if (!(email in coaches)) {
      coaches[email] = {
        individuals: [],
        teams: [],
        indiv_teams: []
      };
    }
    coaches[email].individuals.push({
      name: indiv["Student"],
      id: indiv["ID"],
      score: {
        speed: indiv["Speed Score"],
        accuracy: indiv["Accuracy Score"],
        combined: indiv["Combined"]
      }
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
        indiv_teams: []
      };
    }
    coaches[email].teams.push({
      name: team["Name"],
      id: team["ID"],
      students,
      score: {
        team: team["Team"],
        guts1: team["Guts1"],
        guts2: team["Guts2"],
        guts3: team["Guts3"],
        guts4: team["Guts4"],
        guts5: team["Guts5"],
        guts6: team["Guts6"],
        guts7: team["Guts7"],
        guts8: team["Guts8"],
        gutsSum: team["Guts Sum"],
        combined: team["TEAM COMBINED"]
      }
    });
  });

  const indivTeams = await indivTeamIDSheet.getRows();
  indivTeams.forEach((team) => {
    let emails = team["Coach Emails"].split("; ");
    emails = emails.filter((m) => m.length);
    const id = team["ID"];
    let students = [];
    for (let n of ["Student 1", "Student 2", "Student 3", "Student 4"]) {
      if (team[n] && team[n].length) {
        students.push(team[n]);
      }
    }
    const name = team["Name"];
    for (let email of emails) {
      if (!(email in coaches)) {
        coaches[email] = {
          individuals: [],
          teams: [],
          indiv_teams: []
        };
      }
      coaches[email].indiv_teams.push({
        name,
        id,
        students,
        score: {
          team: team["Team"],
          guts1: team["Guts1"],
          guts2: team["Guts2"],
          guts3: team["Guts3"],
          guts4: team["Guts4"],
          guts5: team["Guts5"],
          guts6: team["Guts6"],
          guts7: team["Guts7"],
          guts8: team["Guts8"],
          gutsSum: team["Guts Sum"],
          combined: team["TEAM COMBINED"]
        }
      });
    }
  });

  //   console.log(coaches["monaksehgal@gmail.com"].teams);
  Object.keys(coaches).forEach(async (coachID, i) => {
    if (!coachID || !coachID.length || coachID === "BACKUP") return;
    // console.log(coachID);

    // if (
    //   coaches[coachID].indiv_teams.length &&
    //   coaches[coachID].individuals.length &&
    //   coaches[coachID].teams.length
    // ) {
    //   console.log(coachID);
    // }

    // if (coachID === "deborah.jasper@edison.k12.nj.us") {
    //   console.log(coaches[coachID]);
    //   console.log(coaches[coachID].individuals);
    // }

    try {
      // console.log(coachID);
      if (coachID === "zhen.chen.04@gmail.com") {
        console.log(coachID);
        await scoresMail(coachID, coaches[coachID]);
        // await scoresMail("nchowdhury@exeter.edu", coaches[coachID]);
      }
    } catch (err) {
      console.log(err);
    }
  });
}

// DONT RUN AGAIN
run();
//
