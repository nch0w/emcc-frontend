require("dotenv").config();
const _ = require("lodash");
const { COMPETITOR_SHEET_ID, GOOGLE_API_CREDENTIALS } = require("../env");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const compDayMail = require("../mail/competitonDay");

const doc = new GoogleSpreadsheet(COMPETITOR_SHEET_ID);
doc.useServiceAccountAuth(GOOGLE_API_CREDENTIALS);

async function run() {
  await doc.loadInfo();

  const indivIDSheet = doc.sheetsByIndex[2];
  const indivs = await indivIDSheet.getRows();
  let ind = indivs.map((indiv) => indiv["Combined Name"]);
  //   console.log(ind.length);
  //   console.log(_.uniq(ind).length);
  let duplicates = [...ind];
  const yourArrayWithoutDuplicates = [...new Set(ind)];
  yourArrayWithoutDuplicates.forEach((item) => {
    const i = duplicates.indexOf(item);
    duplicates = duplicates
      .slice(0, i)
      .concat(duplicates.slice(i + 1, duplicates.length));
  });

  console.log(duplicates);
}

// DONT RUN AGAIN
run();
