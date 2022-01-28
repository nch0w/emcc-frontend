const _ = require("lodash");
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function collect_non_guts() {
  await doc.loadInfo();
  const speedRawSheet = doc.sheetsByTitle["Indiv_speed"];
  const accRawSheet = doc.sheetsByTitle["Indiv_accuracy"];
  const teamRoundRawSheet = doc.sheetsByTitle["Team"];
  /*const gutsRawSheets = [
    doc.sheetsByTitle["Guts_1"],
    doc.sheetsByTitle["Guts_2"],
    doc.sheetsByTitle["Guts_3"],
    doc.sheetsByTitle["Guts_4"],
    doc.sheetsByTitle["Guts_5"],
    doc.sheetsByTitle["Guts_6"],
    doc.sheetsByTitle["Guts_7"],
    doc.sheetsByTitle["Guts_8"]
  ];*/
  const speedRawSource = [
    doc.sheetsByTitle["Speed_A"],
    doc.sheetsByTitle["Speed_B"],
    doc.sheetsByTitle["Speed_C"],
    doc.sheetsByTitle["Speed_D"]
  ];
  const accRawSource = [
    doc.sheetsByTitle["Accuracy_A"],
    doc.sheetsByTitle["Accuracy_B"],
    doc.sheetsByTitle["Accuracy_C"],
    doc.sheetsByTitle["Accuracy_D"]
  ];
  const teamRoundRawSource = [
    doc.sheetsByTitle["Team_A"],
    doc.sheetsByTitle["Team_B"],
    doc.sheetsByTitle["Team_C"],
    doc.sheetsByTitle["Team_D"]
  ];
  /*const gutsRawSource = [
    [
      doc.sheetsByTitle["Guts_1_A"],
      doc.sheetsByTitle["Guts_1_B"],
      doc.sheetsByTitle["Guts_1_C"],
      doc.sheetsByTitle["Guts_1_D"]
    ],
    [
      doc.sheetsByTitle["Guts_2_A"],
      doc.sheetsByTitle["Guts_2_B"],
      doc.sheetsByTitle["Guts_2_C"],
      doc.sheetsByTitle["Guts_2_D"]
    ],
    [
      doc.sheetsByTitle["Guts_3_A"],
      doc.sheetsByTitle["Guts_3_B"],
      doc.sheetsByTitle["Guts_3_C"],
      doc.sheetsByTitle["Guts_3_D"]
    ],
    [
      doc.sheetsByTitle["Guts_4_A"],
      doc.sheetsByTitle["Guts_4_B"],
      doc.sheetsByTitle["Guts_4_C"],
      doc.sheetsByTitle["Guts_4_D"]
    ],
    [
      doc.sheetsByTitle["Guts_5_A"],
      doc.sheetsByTitle["Guts_5_B"],
      doc.sheetsByTitle["Guts_5_C"],
      doc.sheetsByTitle["Guts_5_D"]
    ],
    [
      doc.sheetsByTitle["Guts_6_A"],
      doc.sheetsByTitle["Guts_6_B"],
      doc.sheetsByTitle["Guts_6_C"],
      doc.sheetsByTitle["Guts_6_D"]
    ],
    [
      doc.sheetsByTitle["Guts_7_A"],
      doc.sheetsByTitle["Guts_7_B"],
      doc.sheetsByTitle["Guts_7_C"],
      doc.sheetsByTitle["Guts_7_D"]
    ],
    [
      doc.sheetsByTitle["Guts_8_A"],
      doc.sheetsByTitle["Guts_8_B"],
      doc.sheetsByTitle["Guts_8_C"],
      doc.sheetsByTitle["Guts_8_D"]
    ]
  ];*/
  let speedCombined = [];
  let accCombined = [];
  let teamRoundCombined = [];
  /*let gutsCombined = [[], [], [], [], [], [], [], []];*/

  for (let i = 0; i < speedRawSource.length; i++) {
    let speedSubmissions = await speedRawSource[i].getRows();
    speedCombined.push(...speedSubmissions);
  }
  for (let i = 0; i < accRawSource.length; i++) {
    let accSubmissions = await accRawSource[i].getRows();
    accCombined.push(...accSubmissions);
  }
  for (let i = 0; i < teamRoundRawSource.length; i++) {
    let teamSubmissions = await teamRoundRawSource[i].getRows();
    teamRoundCombined.push(...teamSubmissions);
  }
  /*for(let i = 0; i<gutsRawSource.length; i++){
    for(let j = 0; j<gutsRawSource[i].length; j++){
      let gutsSubmissions = await gutsRawSource[i][j].getRows();
      gutsCombined[i].push(...gutsSubmissions);
    }
  }*/
  await speedRawSheet.addRows(speedCombined);
  await accRawSheet.addRows(accCombined);
  await teamRoundRawSheet.addRows(teamRoundCombined);
  /*for(let i = 0; i<gutsRawSource.length; i++){
    await gutsRawSheets[i].addRows(gutsCombined[i]);
  }*/
  console.log("Form merging complete.");
}
async function collect_guts(ind) {
  await doc.loadInfo();
  //const speedRawSheet = doc.sheetsByTitle["Indiv_speed"];
  //const accRawSheet = doc.sheetsByTitle["Indiv_accuracy"];
  //const teamRoundRawSheet = doc.sheetsByTitle["Team"];
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
  /*const speedRawSource = [
    doc.sheetsByTitle["Speed_A"],
    doc.sheetsByTitle["Speed_B"],
    doc.sheetsByTitle["Speed_C"],
    doc.sheetsByTitle["Speed_D"]
  ];
  const accRawSource = [
    doc.sheetsByTitle["Accuracy_A"],
    doc.sheetsByTitle["Accuracy_B"],
    doc.sheetsByTitle["Accuracy_C"],
    doc.sheetsByTitle["Accuracy_D"]
  ];
  const teamRoundRawSource = [
    doc.sheetsByTitle["Team_A"],
    doc.sheetsByTitle["Team_B"],
    doc.sheetsByTitle["Team_C"],
    doc.sheetsByTitle["Team_D"]
  ];*/
  const gutsRawSource = [
    [
      doc.sheetsByTitle["Guts_1_A"],
      doc.sheetsByTitle["Guts_1_B"],
      doc.sheetsByTitle["Guts_1_C"],
      doc.sheetsByTitle["Guts_1_D"]
    ],
    [
      doc.sheetsByTitle["Guts_2_A"],
      doc.sheetsByTitle["Guts_2_B"],
      doc.sheetsByTitle["Guts_2_C"],
      doc.sheetsByTitle["Guts_2_D"]
    ],
    [
      doc.sheetsByTitle["Guts_3_A"],
      doc.sheetsByTitle["Guts_3_B"],
      doc.sheetsByTitle["Guts_3_C"],
      doc.sheetsByTitle["Guts_3_D"]
    ],
    [
      doc.sheetsByTitle["Guts_4_A"],
      doc.sheetsByTitle["Guts_4_B"],
      doc.sheetsByTitle["Guts_4_C"],
      doc.sheetsByTitle["Guts_4_D"]
    ],
    [
      doc.sheetsByTitle["Guts_5_A"],
      doc.sheetsByTitle["Guts_5_B"],
      doc.sheetsByTitle["Guts_5_C"],
      doc.sheetsByTitle["Guts_5_D"]
    ],
    [
      doc.sheetsByTitle["Guts_6_A"],
      doc.sheetsByTitle["Guts_6_B"],
      doc.sheetsByTitle["Guts_6_C"],
      doc.sheetsByTitle["Guts_6_D"]
    ],
    [
      doc.sheetsByTitle["Guts_7_A"],
      doc.sheetsByTitle["Guts_7_B"],
      doc.sheetsByTitle["Guts_7_C"],
      doc.sheetsByTitle["Guts_7_D"]
    ],
    [
      doc.sheetsByTitle["Guts_8_A"],
      doc.sheetsByTitle["Guts_8_B"],
      doc.sheetsByTitle["Guts_8_C"],
      doc.sheetsByTitle["Guts_8_D"]
    ]
  ];
  //let speedCombined = [];
  //let accCombined = [];
  //let teamRoundCombined = [];
  let gutsCombined = [[], [], [], [], [], [], [], []];

  /*for(let i = 0; i<speedRawSource.length; i++){
    let speedSubmissions = await speedRawSource[i].getRows();
    speedCombined.push(...speedSubmissions);
  }
  for(let i = 0; i<accRawSource.length; i++){
    let accSubmissions = await accRawSource[i].getRows();
    accCombined.push(...accSubmissions);
  }
  for(let i = 0; i<teamRoundRawSource.length; i++){
    let teamSubmissions = await teamRoundRawSource[i].getRows();
    teamRoundCombined.push(...teamSubmissions);
  }*/
  let i = ind;
  for (let j = 0; j < gutsRawSource[i].length; j++) {
    let gutsSubmissions = await gutsRawSource[i][j].getRows();
    gutsCombined[i].push(...gutsSubmissions);
  }
  //await speedRawSheet.addRows(speedCombined);
  //await accRawSheet.addRows(accCombined);
  //await teamRoundRawSheet.addRows(teamRoundCombined);
  //for(let i = 0; i<gutsRawSource.length; i++){
  await gutsRawSheets[i].addRows(gutsCombined[i]);
  //}
  console.log(`Guts form ${i} merging complete.`);
}
//Only for grading
//collect_non_guts();
//collect_guts(7);

module.exports = collect_guts;
