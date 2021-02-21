const _ = require("lodash");
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

function d() {
  // random digit
  return Math.floor(Math.random() * 10);
}

const usedIDs = new Set([""]);

function genIndivID() {
  let id = "";
  while (usedIDs.has(id)) {
    id = `${d()}${d()}50${d()}1${d()}${d()}`;
  }
  return id;
}

function genTeamID() {
  let id = "";
  while (usedIDs.has(id)) {
    id = `${d()}${d()}23${d()}8${d()}${d()}`;
  }
  return id;
}

async function run() {
  let all_teams = [];
  let all_stud = [];

  await doc.loadInfo();
  const teamSheet = doc.sheetsByIndex[0];
  const individualSheet = doc.sheetsByIndex[1];
  const indivIDSheet = doc.sheetsByIndex[2];
  const teamIDSheet = doc.sheetsByIndex[3];
  const indivTeamIDSheet = doc.sheetsByIndex[4];

  const teams = await teamSheet.getRows();
  teams.forEach((team) => {
    const newTeam = {
      id: genTeamID(),
      name: team["Name"],
      members: [],
      coachEmail: team["Coach Email"]
    };
    for (let n of ["Student 1", "Student 2", "Student 3", "Student 4"]) {
      if (team[n] && team[n].length) {
        const id = genIndivID();
        all_stud.push({
          name: team[n],
          coachEmail: team["Coach Email"],
          id
        });
        newTeam.members.push({
          name: team[n],
          id
        });
      }
    }
    all_teams.push(newTeam);
  });

  const all_indiv_teams = {};

  const individuals = await individualSheet.getRows();
  individuals.forEach((indiv) => {
    if (indiv["Student"] && indiv["Student"].length) {
      const id = genIndivID();
      all_stud.push({
        name: indiv["Student"],
        coachEmail: indiv["Coach Email"],
        id
      });
      if (indiv["Team"] && indiv["Team"].length) {
        const t = indiv["Team"];
        if (!(t in all_indiv_teams)) {
          all_indiv_teams[t] = {
            name: `Individual ${t}`,
            id: genTeamID(),
            members: [],
            email: ""
          };
        }

        all_indiv_teams[t].members.push({ name: indiv["Student"], id });
        all_indiv_teams[t].email += `${indiv["Coach Email"]}; `;
      }
    }
  });

  const indiv_id = all_stud.map((indiv) => {
    return {
      Student: indiv.name,
      "Coach Email": indiv.coachEmail,
      ID: indiv.id
    };
  });

  const team_id = all_teams.map((team) => {
    let retTeam = {
      Name: team.name,
      "Coach Email": team.coachEmail,
      ID: team.id
    };
    team.members.forEach((m, i) => {
      retTeam[`Student ${i + 1}`] = m.name;
      retTeam[`S${i + 1} ID`] = m.id;
    });
    return retTeam;
  });

  const indiv_team_id = Object.keys(all_indiv_teams).map((team_key) => {
    const team = all_indiv_teams[team_key];
    let retTeam = {
      Name: team.name,
      "Coach Emails": team.email,
      ID: team.id
    };
    team.members.forEach((m, i) => {
      retTeam[`Student ${i + 1}`] = m.name;
      retTeam[`S${i + 1} ID`] = m.id;
    });
    return retTeam;
  });

  await indivIDSheet.addRows(indiv_id);
  await indivTeamIDSheet.addRows(indiv_team_id);
  await teamIDSheet.addRows(team_id);

  //   console.log(indiv_team_id[0]);
  //   await indivIDSheet;

  // console.log(indiv_arr[indiv_arr.length - 1]);
  //   let indiv_id = indiv_arr.map((indiv) => {
  //     return {
  //       Student: indiv.name,
  //       "Coach Email": indiv.coachEmail,
  //       ID: genIndivID()
  //     };
  //   });

  //   await indivIDSheet.addRows(indiv_id);
  // console.log(indiv_id[0]);
}

// DONT RUN AGAIN
// run();
