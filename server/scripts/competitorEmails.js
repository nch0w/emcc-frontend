require("dotenv").config();
const base = require("airtable").base("appbYCJZl5hVES98p");
const competitorsMail = require("../mail/competitors");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question(
  "This will send an email to all the coaches. Type 'YES` to confirm: ",
  (password) => {
    if (
      password === "YES" ||
      password === "yes" ||
      password === "Yes" ||
      password === "Y" ||
      password === "y"
    ) {
      run();
      readline.close();
    } else {
      process.exit(1);
    }
  }
);

function run() {
  let work = true;
  base("Coaches")
    .select({
      maxRecords: 1000
    })
    .eachPage(
      async function page(records, fetchNextPage) {
        // console.log("hello");
        // // This function (`page`) will get called for each page of records.
        records.forEach(async function (record) {
          if (
            record.fields["Competitors"] &&
            record.fields["Competitors"].length
          ) {
            // console.log("Retrieved", record.get("Email"));
            if (record.fields["Email"] === "danplo@bergen.org") {
              const teams = [];
              const individuals = [];
              const competitors = await base("Competitors")
                .select({
                  filterByFormula: `{Coach Email} = '${record.fields["Email"]}'`
                })
                .firstPage();

              for (let competitor of competitors) {
                if (competitor.fields.Individual) {
                  individuals.push({
                    id: competitor.id,
                    student: competitor.fields["Student 1"]
                  });
                } else {
                  teams.push({
                    id: competitor.id,
                    name: competitor.fields.Name,
                    student1: competitor.fields["Student 1"],
                    student2: competitor.fields["Student 2"],
                    student3: competitor.fields["Student 3"],
                    student4: competitor.fields["Student 4"]
                  });
                }
              }
              console.log(record.get("Email"));
              //await competitorsMail(record.fields.Email, teams, individuals);
              await competitorsMail("abu@exeter.edu", teams, individuals);
            }
          }
        });

        // // To fetch the next page of records, call `fetchNextPage`.
        // // If there are more records, `page` will get called again.
        // // If there are no more records, `done` will get called.
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
}
