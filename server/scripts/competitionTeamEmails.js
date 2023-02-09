require("dotenv").config();
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const compDayMail = require("../mail/competitionDay");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await doc.loadInfo();

  const indivIDSheet = doc.sheetsByTitle["Individuals"];
  const teamIDSheet = doc.sheetsByTitle["Teams"];

  const indivs = await indivIDSheet.getRows();
  const coaches = {};
  const indivIDs = [];

  indivs.forEach((indiv) => {
    const email = indiv["Coach Email"];
    if (!(email in coaches)) {
      coaches[email] = {
        individuals: [],
        teams: [],
        email
      };
    }
    coaches[email].individuals.push({
      name: indiv["Student Name"]
    });
  });

  const teams = await teamIDSheet.getRows();
  teams.forEach((team) => {
    const email = team["Coach Email"];
    let students = [];
    if (email == "") {
      for (let n of [
        "Competitor 01",
        "Competitor 02",
        "Competitor 03",
        "Competitor 04"
      ]) {
        if (team[n] && team[n].length) {
          indivIDs.push({
            name: team[n],
            id: team["ID"] + "-" + n.slice(-2)
          });
        }
      }
      return false;
    }
    for (let n of [
      "Competitor 01",
      "Competitor 02",
      "Competitor 03",
      "Competitor 04"
    ]) {
      if (team[n] && team[n].length) {
        students.push({
          name: team[n],
          id: team["ID"] + "-" + n.slice(-2)
        });
      }
    }
    if (!(email in coaches)) {
      coaches[email] = {
        individuals: [],
        teams: [],
        email
      };
    }
    coaches[email].teams.push({
      name: team["Team Name"],
      id: team["ID"],
      students
    });
  });
  let searchName = function (name) {
    let ret = null;
    let ind = null;
    Object.keys(coaches).forEach((coach) => {
      //console.log(coaches[coach]);
      for (let i = 0; i < coaches[coach].individuals.length; i++) {
        if (coaches[coach].individuals[i].name == name) {
          ret = coaches[coach].email;
          ind = i;
          break;
        }
      }
    });
    return { coach: ret, index: ind };
  };
  indivIDs.forEach((student) => {
    let coach_info = searchName(student.name);
    if (!coaches[coach_info.coach]) {
      console.log(`Coach not found: ${coach_info}, ${student.name}`);
      return false;
    }
    coaches[coach_info.coach].individuals[coach_info.index].id = student.id;
  });

  //   console.log(coaches["monaksehgal@gmail.com"].teams);
  Object.keys(coaches).forEach(async (coachID, i) => {
    if (!coachID || !coachID.length) return;
    if (coachID !== "yihou@hotmail.com") return;
    console.log(coachID);
    try {
      await compDayMail(coachID, coaches[coachID]);
      //await compDayMail("abu@exeter.edu", coaches[coachID]);
    } catch (err) {
      console.log(err);
    }
    // await compDayMail(coachID, coaches[coachID]);
  });
}

// DONT RUN AGAIN
//run();
