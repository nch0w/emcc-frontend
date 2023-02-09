require("dotenv").config();
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const compDayMail = require("../mail/scoreReports");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await doc.loadInfo();

  const indivIDSheet = doc.sheetsByTitle["Individuals (reg)"];
  const teamIDSheet = doc.sheetsByTitle["Teams (reg)"];

  const individualScoreSheet = doc.sheetsByTitle["IndivGrading"];
  const sweepstakesSheet = doc.sheetsByTitle["Sweepstakes"];

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
      name: indiv["Student Name"],
      scores: {
        speed: null,
        accuracy: null,
        teamName: null,
        team: null,
        guts: null
      }
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
            id: team["ID"] + "-" + n.slice(-2),
            scores: { speed: null, accuracy: null }
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
          id: team["ID"] + "-" + n.slice(-2),
          scores: { speed: null, accuracy: null }
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
      scores: { team: null, guts: null },
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
  let searchID = function (name) {
    let ret = null;
    let ind = null;
    let tind = null;
    let breakAll = false;
    Object.keys(coaches).forEach((coach) => {
      //console.log(coaches[coach]);
      for (let i = 0; i < coaches[coach].individuals.length; i++) {
        if (coaches[coach].individuals[i].id == name) {
          ret = coaches[coach].email;
          ind = i;
          breakAll = true;
          break;
        }
      }
      for (let i = 0; i < coaches[coach].teams.length; i++) {
        if (breakAll) {
          break;
        }
        for (let j = 0; j < coaches[coach].teams[i].students.length; j++) {
          if (coaches[coach].teams[i].students[j].id == name) {
            ret = coaches[coach].email;
            ind = j;
            tind = i;
            break;
          }
        }
      }
    });
    return { coach: ret, index: ind, team: tind };
  };
  indivIDs.forEach((student) => {
    let coach_info = searchName(student.name);
    if (!coaches[coach_info.coach]) {
      console.log(`Coach not found: ${coach_info}, ${student.name}`);
      return false;
    }
    coaches[coach_info.coach].individuals[coach_info.index].id = student.id;
  });

  const indivScores = await individualScoreSheet.getRows();

  indivScores.forEach((entry) => {
    if (!entry["fo"] || !entry["Indiv ID"] || !entry["Student Name"]) {
      return;
    }

    let entryID = `${entry["fo"]}-0${entry["Indiv ID"]}`;
    let searched = searchID(entryID);
    if (searched.coach == null) {
      console.log(`Not found ID: ${entryID}`);
      return;
    }

    if (searched.team != null) {
      coaches[searched.coach].teams[searched.team].students[
        searched.index
      ].scores.speed = entry["Speed Score"];
      coaches[searched.coach].teams[searched.team].students[
        searched.index
      ].scores.accuracy = entry["Acc Score"];
    } else {
      coaches[searched.coach].individuals[searched.index].scores.speed =
        entry["Speed Score"];
      coaches[searched.coach].individuals[searched.index].scores.accuracy =
        entry["Acc Score"];
    }
  });

  const sweepstakes = await sweepstakesSheet.getRows();

  sweepstakes.forEach((entry) => {
    if (!entry["Team ID"] || !entry["Team Name"]) {
      return;
    }

    let entryIDs = Array(4)
      .fill()
      .map((x) => entry["Team ID"])
      .map((y, i) => y + "-0" + (i + 1));
    let searched = entryIDs.map((x) => searchID(x));

    searched.forEach((search) => {
      if (search.coach == null) {
        return;
      }

      if (search.team != null) {
        if (coaches[search.coach].teams[search.team].id != entry["Team ID"]) {
          console.log(
            `Team Mismatch: ${
              coaches[search.coach].teams[search.team].id
            } and ${entry["Team ID"]}`
          );
          return;
        }
        coaches[search.coach].teams[search.team].scores.team = entry["Team"];
        coaches[search.coach].teams[search.team].scores.guts = entry["Guts"];
      } else {
        coaches[search.coach].individuals[search.index].scores.teamName =
          entry["Team Name"];
        coaches[search.coach].individuals[search.index].scores.team =
          entry["Team"];
        coaches[search.coach].individuals[search.index].scores.guts =
          entry["Guts"];
      }
    });
  });

  var list = [];
  Object.keys(coaches).forEach(async (coachID, i) => {
    if (!coachID || !coachID.length) return;
    //if (coachID !== "Walkernj20@gmail.com") return;

    list.push([coachID, i]);
  });
  for (let t = 0; t < list.length; t++) {
    await sendAsync(list[t][0], list[t][1]);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async function sendAsync(coachID, i) {
    //if (!coachID || !coachID.length) return;
    //if (coachID !== "Liliuu30@gmail.com") return;
    console.log(coachID);

    try {
      //await compDayMail(coachID, coaches[coachID]);
      await compDayMail("abu@exeter.edu", coaches[coachID]);
    } catch (err) {
      console.log(err);
    }
  }
}

// DONT RUN AGAIN
//run();
