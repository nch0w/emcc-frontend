require("dotenv").config();
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
//const generalMail = require("../mail/signup.js");
const generalMail = function () {};
const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await doc.loadInfo();

  const indivIDSheet = doc.sheetsByTitle["Individual_IDs"];
  const teamIDSheet = doc.sheetsByTitle["Team_IDs"];

  const indivs = await indivIDSheet.getRows();
  const coaches = [];
  indivs.forEach((indiv) => {
    const email = indiv["Coach Email"];
    if (!coaches.includes(email)) {
      coaches.push(email);
    }
  });

  const teams = await teamIDSheet.getRows();
  teams.forEach((team) => {
    const email = team["Coach Email"];

    if (!coaches.includes(email)) {
      coaches.push(email);
    }
  });

  console.log(coaches.length);
  console.log(coaches.join("; "));

  //   console.log(coaches["monaksehgal@gmail.com"].teams);
  // coaches.map(async (coachID) => {
  //   if (!coachID || !coachID.length) return;
  //   //if (coachID !== "xiaoyuan@gmail.com") return;
  //   console.log(coachID);
  //   try {
  //     await generalMail(coachID, coaches[coachID]);
  //     //await generalMail('abu@exeter.edu', coaches[coachID]);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   // await compDayMail(coachID, coaches[coachID]);
  // });
}
//Careful: This sends Emails
run();
