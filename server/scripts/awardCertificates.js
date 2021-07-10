require("dotenv").config();
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const awardMail = require("../mail/awardCertificate");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
const awards = new GoogleSpreadsheet(
  "1F4lBoN1Jbj_Nyx8Nogsy8Jfk3FaFteKEoSMSFXrenA0"
);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);
awards.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await awards.loadInfo();
  const speed = await awards.sheetsByIndex[0].getRows();
  const accuracy = await awards.sheetsByIndex[1].getRows();
  const individual = await awards.sheetsByIndex[2].getRows();
  const team = await awards.sheetsByIndex[3].getRows();
  const guts = await awards.sheetsByIndex[4].getRows();
  const sweepstakes = await awards.sheetsByIndex[5].getRows();

  await doc.loadInfo();

  const indivIDSheet = doc.sheetsByIndex[2];
  const teamIDSheet = doc.sheetsByIndex[3];
  const indivTeamIDSheet = doc.sheetsByIndex[4];

  const coaches = {};

  const allIndivs = {};
  const allTeams = {};

  const indivs = await indivIDSheet.getRows();
  indivs.forEach((indiv) => {
    allIndivs[indiv["ID"]] = {
      name: indiv["Student"],
      email: indiv["Coach Email"]
    };
  });

  const teams = await teamIDSheet.getRows();
  teams.forEach((team) => {
    allTeams[team["ID"]] = {
      name: team["Name"],
      email: team["Coach Email"]
    };
  });

  const indivTeamAward = [
    {
      name: "Individual 19",
      award: "10th Place, Team Round",
      shortAward: "Team"
    }
  ];
  coaches["andrew.carratu@gmail.com"] = indivTeamAward;
  coaches["chithrag@gmail.com"] = indivTeamAward;
  coaches["karen.legault@asdnh.org"] = indivTeamAward;

  speed.forEach((comp) => {
    const indiv = allIndivs[comp["ID"]];
    const award = {
      name: indiv.name,
      award: `${comp["Rank"]} Place, Speed Round`,
      shortAward: "Speed"
    };
    if (indiv.email in coaches) {
      coaches[indiv.email].push(award);
    } else {
      coaches[indiv.email] = [award];
    }
  });

  accuracy.forEach((comp) => {
    const indiv = allIndivs[comp["ID"]];
    const award = {
      name: indiv.name,
      award: `${comp["Rank"]} Place, Accuracy Round`,
      shortAward: "Accuracy"
    };
    if (indiv.email in coaches) {
      coaches[indiv.email].push(award);
    } else {
      coaches[indiv.email] = [award];
    }
  });

  individual.forEach((comp) => {
    const indiv = allIndivs[comp["ID"]];
    const award = {
      name: indiv.name,
      award: `${comp["Rank"]} Place Individual`,
      shortAward: "Individual"
    };
    if (indiv.email in coaches) {
      coaches[indiv.email].push(award);
    } else {
      coaches[indiv.email] = [award];
    }
  });

  team.forEach((comp) => {
    const indiv = allTeams[comp["ID"]];
    const award = {
      name: indiv.name,
      award: `${comp["Rank"]} Place, Team Round`,
      shortAward: "Team"
    };
    if (indiv.email in coaches) {
      coaches[indiv.email].push(award);
    } else {
      coaches[indiv.email] = [award];
    }
  });

  guts.forEach((comp) => {
    const indiv = allTeams[comp["ID"]];
    console.log(indiv);
    const award = {
      name: indiv.name,
      award: `${comp["Rank"]} Place, Guts Round`,
      shortAward: "Guts"
    };
    if (indiv.email in coaches) {
      coaches[indiv.email].push(award);
    } else {
      coaches[indiv.email] = [award];
    }
  });

  sweepstakes.forEach((comp) => {
    const indiv = allTeams[comp["ID"]];
    console.log(indiv);
    const award = {
      name: indiv.name,
      award: `${comp["Rank"]} Place, Team Sweepstakes`,
      shortAward: "Sweepstakes"
    };
    if (indiv.email in coaches) {
      coaches[indiv.email].push(award);
    } else {
      coaches[indiv.email] = [award];
    }
  });

  // console.log(coaches);

  // await awardMail("kcong@exeter.edu", [
  //   {
  //     name: "Cevin Kong",
  //     award: "69th Place, Accuracy Round",
  //     shortAward: "Accuracy"
  //   }
  // ]);

  //   console.log(coaches["monaksehgal@gmail.com"].teams);
  Object.keys(coaches).forEach(async (coachID, i) => {
    if (!coachID || !coachID.length || coachID === "BACKUP") return;
    try {
      console.log(coachID);
      await awardMail(coachID, coaches[coachID]);
      // await awardMail("nchowdhury@exeter.edu", coaches[coachID]);
    } catch (err) {
      console.log(err);
    }
  });
}

// DONT RUN AGAIN
// run();
//
