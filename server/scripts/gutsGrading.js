const _ = require("lodash");
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function grade() {
  let all_teams = [];
  let all_stud = [];

  await doc.loadInfo();
  // load answer key
  const answerKeySheet = doc.sheetsByTitle["Answer_Key"];
  const answerKeyRows = await answerKeySheet.getRows();
  const speedAns = _.range(1, 21).map((n) =>
    parseInt(answerKeyRows[0][`${n}`])
  );
  const accuracyAns = _.range(1, 11).map((n) =>
    parseInt(answerKeyRows[1][`${n}`])
  );
  const teamAns = _.range(1, 16).map((n) => parseInt(answerKeyRows[2][`${n}`]));
  const gutsAns = _.range(1, 25).map((n) => parseInt(answerKeyRows[3][`${n}`]));
  const gutsWeights = [6, 7, 9, 11, 13, 15, 18, 21];

  const teamSheet = doc.sheetsByTitle["Teams"];
  const individualSheet = doc.sheetsByTitle["Individuals"];
  const indivIDSheet = doc.sheetsByTitle["Individual_IDs"];
  const teamIDSheet = doc.sheetsByTitle["Team_IDs"];
  const indivTeamIDSheet = doc.sheetsByTitle["Indiv_Team_IDs"];
  const speedRawSheet = doc.sheetsByTitle["Indiv_speed"];
  const accRawSheet = doc.sheetsByTitle["Indiv_accuracy"];
  const teamRoundRawSheet = doc.sheetsByTitle["Team"];
  const gutsRawSheets = [
    doc.sheetsByTitle["Guts_1"],
    doc.sheetsByTitle["Guts_2"],
    doc.sheetsByTitle["Guts_3"],
    doc.sheetsByTitle["Guts_4"],
    doc.sheetsByTitle["Guts_5"],
    doc.sheetsByTitle["Guts_6"],
    doc.sheetsByTitle["Guts_7"],
    doc.sheetsByTitle["Guts_8"]
  ];
  const speedSheet = doc.sheetsByTitle["Speed_rank"];
  const accSheet = doc.sheetsByTitle["Accuracy_rank"];
  const indivSheet = doc.sheetsByTitle["Individual_rank"];
  const teamRoundSheet = doc.sheetsByTitle["Team_rank"];
  const gutsSheet = doc.sheetsByTitle["Guts_rank"];
  const compoSheet = doc.sheetsByTitle["Composite_rank"];

  const teams = await teamIDSheet.getRows();
  teams.forEach((team) => {
    const newTeam = {
      id: team["ID"],
      name: team["Name"],
      members: []
    };
    for (let n of [
      ["Student 1", "S1 ID"],
      ["Student 2", "S2 ID"],
      ["Student 3", "S3 ID"],
      ["Student 4", "S4 ID"]
    ]) {
      if (team[n[0]] && team[n[0]].length) {
        const id = team[n[1]];
        all_stud.push({
          name: team[n[0]],
          team: team["ID"],
          id
        });
        newTeam.members.push({
          name: team[n[0]],
          id
        });
      }
    }
    all_teams.push(newTeam);
  });

  const individualTeams = await indivTeamIDSheet.getRows();
  individualTeams.forEach((indiv) => {
    if (indiv["Name"] && indiv["Name"].length) {
      const id = indiv["ID"];
      const newTeam = {
        id: indiv["ID"],
        name: indiv["Name"],
        members: []
      };
      for (let n of [
        ["Student 1", "S1 ID"],
        ["Student 2", "S2 ID"],
        ["Student 3", "S3 ID"],
        ["Student 4", "S4 ID"]
      ]) {
        if (indiv[n[0]] && indiv[n[0]].length) {
          const id = indiv[n[1]];
          all_stud.push({
            name: indiv[n[0]],
            team: indiv["ID"],
            id
          });
          newTeam.members.push({
            name: indiv[n[0]],
            id
          });
        }
      }
      all_teams.push(newTeam);
    }
  });
  all_stud.forEach((student) => {
    student.scores = [0, 0];
    student.tiebreaks = [0, 0, 0];
    student.total = 0;
  });
  all_teams.forEach((team) => {
    team.scores = [0, 0];
    team.tiebreaks = [0, 0, 0];
    team.total = 0;
    team.gutsProgress = 0;
  });
  let locateStudentID = function (id) {
    for (let student of all_stud) {
      if (student.id == id) {
        return student;
      }
    }
    console.log("Unmatched Student ID: " + id);
    return null;
  };
  let locateTeamID = function (id) {
    for (let team of all_teams) {
      if (team.id == id) {
        return team;
      }
    }
    console.log("Unmatched Team ID: " + id);
    return null;
  };
  const speedSubmissions = await speedRawSheet.getRows();
  speedSubmissions.forEach((submission) => {
    if (submission["Individual ID"] && submission["Individual ID"].length) {
      let student = locateStudentID(submission["Individual ID"]);
      if (student !== null && student.tiebreaks[0] == 0) {
        for (let i = 1; i < 21; i++) {
          if (submission[i + "."] && submission[i + "."].length) {
            if (submission[i + "."] == "" + speedAns[i - 1]) {
              student.scores[0] += 3;
              student.tiebreaks[0] += Math.pow(2, i - 1);
            }
          }
        }
        student.tiebreaks[0] = Math.max(1, student.tiebreaks[0]);
      }
    }
  });
  const accSubmissions = await accRawSheet.getRows();
  accSubmissions.forEach((submission) => {
    if (submission["Individual ID"] && submission["Individual ID"].length) {
      let student = locateStudentID(submission["Individual ID"]);
      if (student !== null && student.tiebreaks[1] == 0) {
        for (let i = 1; i < 11; i++) {
          if (submission[i + "."] && submission[i + "."].length) {
            if (submission[i + "."] == "" + accuracyAns[i - 1]) {
              student.scores[1] += 9;
              student.tiebreaks[1] += Math.pow(2, i - 1);
            }
          }
        }
        student.tiebreaks[1] = Math.max(1, student.tiebreaks[1]);
      }
    }
  });
  all_stud.forEach((student) => {
    student.tiebreaks[0] += 2000000 * student.scores[0];
    student.tiebreaks[1] += 2000 * student.scores[1];
    student.total = student.scores[0] + student.scores[1];
    student.tiebreaks[2] =
      400000000000000 * student.total +
      200000000 * student.tiebreaks[1] +
      student.tiebreaks[0];
  });
  const teamSubmissions = await teamRoundRawSheet.getRows();
  teamSubmissions.forEach((submission) => {
    if (submission["Team ID"] && submission["Team ID"].length) {
      let team = locateTeamID(submission["Team ID"]);
      if (team !== null && team.tiebreaks[0] == 0) {
        for (let i = 1; i < 16; i++) {
          if (submission[i + "."] && submission[i + "."].length) {
            if (submission[i + "."] == "" + teamAns[i - 1]) {
              team.scores[0] += 20;
              team.tiebreaks[0] += Math.pow(2, i - 1);
            }
          }
        }
        team.tiebreaks[0] = Math.max(1, team.tiebreaks[0]);
      }
    }
  });
  const gutsSubmissions = [null, null, null, null, null, null, null, null];
  gutsSubmissions[0] = await gutsRawSheets[0].getRows();
  gutsSubmissions[1] = await gutsRawSheets[1].getRows();
  gutsSubmissions[2] = await gutsRawSheets[2].getRows();
  gutsSubmissions[3] = await gutsRawSheets[3].getRows();
  gutsSubmissions[4] = await gutsRawSheets[4].getRows();
  gutsSubmissions[5] = await gutsRawSheets[5].getRows();
  gutsSubmissions[6] = await gutsRawSheets[6].getRows();
  gutsSubmissions[7] = await gutsRawSheets[7].getRows();
  for (let round = 0; round < 8; round++) {
    gutsSubmissions[round].forEach((submission) => {
      if (submission["Team ID"] && submission["Team ID"].length) {
        let team = locateTeamID(submission["Team ID"]);
        if (team != null && team.gutsProgress == round) {
          team.gutsProgress += 1;
          for (let i = 3 * round + 1; i < 3 * round + 4; i++) {
            if (submission[i + "."] && submission[i + "."].length) {
              if (submission[i + "."].trim() == "" + gutsAns[i - 1]) {
                team.scores[1] += gutsWeights[round];
                team.tiebreaks[1] += Math.pow(2, i - 1);
              }
            }
          }
        }
      }
    });
  }
  all_teams.forEach((team) => {
    team.tiebreaks[0] += 200000 * team.scores[0];
    team.tiebreaks[1] += 20000000 * team.scores[1];
    team.total = team.scores[0] + team.scores[1];
    for (n of team.members) {
      if (n.id && n.id.length) {
        let student = locateStudentID(n.id);
        if (student !== null) {
          team.total += student.total;
        }
      }
    }
    team.tiebreaks[2] =
      40000000000000000000 * team.total +
      team.tiebreaks[1] * 200000000 +
      team.tiebreaks[0];
  });

  all_stud.sort(function (a, b) {
    return b.tiebreaks[0] - a.tiebreaks[0];
  });
  const speed_lead = all_stud.map((indiv) => {
    return {
      Student: indiv.name,
      Score: indiv.scores[0],
      Tiebreak: indiv.tiebreaks[0]
    };
  });
  all_stud.sort(function (a, b) {
    return b.tiebreaks[1] - a.tiebreaks[1];
  });
  const acc_lead = all_stud.map((indiv) => {
    return {
      Student: indiv.name,
      Score: indiv.scores[1],
      Tiebreak: indiv.tiebreaks[1]
    };
  });
  all_stud.sort(function (a, b) {
    return b.tiebreaks[2] - a.tiebreaks[2];
  });
  const indiv_lead = all_stud.map((indiv) => {
    return {
      Student: indiv.name,
      Score: indiv.total,
      Tiebreak: indiv.tiebreaks[2]
    };
  });
  all_teams.sort(function (a, b) {
    return b.tiebreaks[0] - a.tiebreaks[0];
  });
  const team_lead = all_teams.map((team) => {
    return {
      Team: team.name,
      Score: team.scores[0],
      Tiebreak: team.tiebreaks[0]
    };
  });
  all_teams.sort(function (a, b) {
    return b.tiebreaks[1] - a.tiebreaks[1];
  });
  const guts_lead = all_teams.map((team) => {
    return {
      Team: team.name,
      Score: team.scores[1],
      Tiebreak: team.tiebreaks[1]
    };
  });
  all_teams.sort(function (a, b) {
    return b.tiebreaks[2] - a.tiebreaks[2];
  });
  const compo_lead = all_teams.map((team) => {
    return {
      Team: team.name,
      Score: team.total,
      Tiebreak: team.tiebreaks[2]
    };
  });

  await speedSheet.addRows(speed_lead);
  await accSheet.addRows(acc_lead);
  await indivSheet.addRows(indiv_lead);
  await teamRoundSheet.addRows(team_lead);
  await gutsSheet.addRows(guts_lead);
  await compoSheet.addRows(compo_lead);
}
async function grade_guts() {
  let all_teams = [];
  let all_stud = [];
  const answerKeySheet = doc.sheetsByTitle["Answer_Key"];
  const answerKeyRows = await answerKeySheet.getRows();
  const gutsAns = _.range(1, 25).map((n) => parseInt(answerKeyRows[3][`${n}`]));
  const gutsWeights = [6, 7, 9, 11, 13, 15, 18, 21];

  await doc.loadInfo();
  const teamSheet = doc.sheetsByTitle["Teams"];
  const individualSheet = doc.sheetsByTitle["Individuals"];
  const indivIDSheet = doc.sheetsByTitle["Individual_IDs"];
  const teamIDSheet = doc.sheetsByTitle["Team_IDs"];
  const indivTeamIDSheet = doc.sheetsByTitle["Indiv_Team_IDs"];
  const gutsRawSheets = [
    doc.sheetsByTitle["Guts_1"],
    doc.sheetsByTitle["Guts_2"],
    doc.sheetsByTitle["Guts_3"],
    doc.sheetsByTitle["Guts_4"],
    doc.sheetsByTitle["Guts_5"],
    doc.sheetsByTitle["Guts_6"],
    doc.sheetsByTitle["Guts_7"],
    doc.sheetsByTitle["Guts_8"]
  ];

  const teams = await teamIDSheet.getRows();
  teams.forEach((team) => {
    const newTeam = {
      id: team["ID"],
      name: team["Name"],
      members: []
    };
    for (let n of [
      ["Student 1", "S1 ID"],
      ["Student 2", "S2 ID"],
      ["Student 3", "S3 ID"],
      ["Student 4", "S4 ID"]
    ]) {
      if (team[n[0]] && team[n[0]].length) {
        const id = team[n[1]];
        all_stud.push({
          name: team[n[0]],
          team: team["ID"],
          id
        });
        newTeam.members.push({
          name: team[n[0]],
          id
        });
      }
    }
    all_teams.push(newTeam);
  });

  const individualTeams = await indivTeamIDSheet.getRows();
  individualTeams.forEach((indiv) => {
    if (indiv["Name"] && indiv["Name"].length) {
      const id = indiv["ID"];
      const newTeam = {
        id: indiv["ID"],
        name: indiv["Name"],
        members: []
      };
      for (let n of [
        ["Student 1", "S1 ID"],
        ["Student 2", "S2 ID"],
        ["Student 3", "S3 ID"],
        ["Student 4", "S4 ID"]
      ]) {
        if (indiv[n[0]] && indiv[n[0]].length) {
          const id = indiv[n[1]];
          all_stud.push({
            name: indiv[n[0]],
            team: indiv["ID"],
            id
          });
          newTeam.members.push({
            name: indiv[n[0]],
            id
          });
        }
      }
      all_teams.push(newTeam);
    }
  });
  all_teams.forEach((team) => {
    team.score = 0;
    team.tiebreak = 0;
    team.total = 0;
    team.gutsProgress = 0;
  });
  let locateTeamID = function (id) {
    for (let team of all_teams) {
      if (team.id == id) {
        return team;
      }
    }
    console.log("Unmatched Team ID: " + id);
    return null;
  };
  const gutsSubmissions = [null, null, null, null, null, null, null, null];
  gutsSubmissions[0] = await gutsRawSheets[0].getRows();
  gutsSubmissions[1] = await gutsRawSheets[1].getRows();
  gutsSubmissions[2] = await gutsRawSheets[2].getRows();
  gutsSubmissions[3] = await gutsRawSheets[3].getRows();
  gutsSubmissions[4] = await gutsRawSheets[4].getRows();
  gutsSubmissions[5] = await gutsRawSheets[5].getRows();
  gutsSubmissions[6] = await gutsRawSheets[6].getRows();
  gutsSubmissions[7] = await gutsRawSheets[7].getRows();
  for (let round = 0; round < 8; round++) {
    gutsSubmissions[round].forEach((submission) => {
      if (submission["Team ID"] && submission["Team ID"].length) {
        let team = locateTeamID(submission["Team ID"]);
        if (team != null && team.gutsProgress == round) {
          team.gutsProgress += 1;
          for (let i = 3 * round + 1; i < 3 * round + 4; i++) {
            if (submission[i + "."] && submission[i + "."].length) {
              if (submission[i + "."].trim() == "" + gutsAns[i - 1]) {
                team.score += gutsWeights[round];
                team.tiebreak += Math.pow(2, i - 1);
              }
            }
          }
        }
      }
    });
  }
  all_teams.forEach((team) => {
    team.total = 40000000000000000000 * team.score + team.tiebreak;
  });
  all_teams.sort(function (a, b) {
    return b.total - a.total;
  });
  const guts_lead = all_teams.map((team) => {
    return { name: team.name, score: team.score };
  });
  console.log("grading finished!");
  return guts_lead;
}

// DONT RUN AGAIN! (Except guts)
//grade();
//grade_guts();
module.exports = grade_guts;
