require("dotenv").config();
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const compDayMail = require("../mail/competitonDay");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await doc.loadInfo();

  const indivIDSheet = doc.sheetsByTitle["Individual_(reg)"];
  const teamIDSheet = doc.sheetsByTitle["Teams_(reg)"];

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
      name: indiv["Student Name"],
      id: indiv["Indiv ID"]
    });
  });

  const teams = await teamIDSheet.getRows();
  teams.forEach((team) => {
    const email = team["Coach Email"];
    let students = [];
    for (let n of [
      "Competitor 01",
      "Competitor 02",
      "Competitor 03",
      "Competitor 04"
    ]) {
      if (team[n] && team[n].length) {
        students.push(team[n]);
      }
    }
    if (!email || email.length == 0) {
      let students = [];
      let emails = new Set([]);
      for (let n of [
        ["Competitor 01", "S1 ID"],
        ["Competitor 02", "S2 ID"],
        ["Competitor 03", "S3 ID"],
        ["Competitor 04", "S4 ID"]
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
      return true;
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
      name: team["Team Name"],
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
  //   console.log(coaches["monaksehgal@gmail.com"].teams);
  Object.keys(coaches).forEach(async (coachID, i) => {
    if (!coachID || !coachID.length) return;
    if (coachID !== "cpan8888@gmail.com") return;
    console.log(coachID);
    try {
      //await compDayMail(coachID, coaches[coachID]);
      await compDayMail("abu@exeter.edu", coaches[coachID]);
    } catch (err) {
      console.log(err);
    }
    // await compDayMail(coachID, coaches[coachID]);
  });
}

// DONT RUN AGAIN
//run();
