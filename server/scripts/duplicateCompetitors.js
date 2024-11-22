require("dotenv").config();
const base = require("airtable").base("appE6gKCmdpqhsPa8");

let emails = [];

base("Coaches")
  .select({
    maxRecords: 1000
  })
  .eachPage(
    async function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(async function (record) {
        // console.log("Retrieved", record.get("Email"));
        if (
          record.fields["Competitors"] &&
          record.fields["Competitors"].length
        ) {
          const teams = [];
          const individuals = [];
          const students = [];
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
              students.push(competitor.fields["Student 1"]);
            } else {
              teams.push({
                id: competitor.id,
                name: competitor.fields.Name,
                student1: competitor.fields["Student 1"],
                student2: competitor.fields["Student 2"],
                student3: competitor.fields["Student 3"],
                student4: competitor.fields["Student 4"]
              });
              students.push(competitor.fields["Student 1"]);
              students.push(competitor.fields["Student 2"]);
              if (competitor.fields["Student 3"]) {
                students.push(competitor.fields["Student 3"]);
              }
              if (competitor.fields["Student 4"]) {
                students.push(competitor.fields["Student 4"]);
              }
            }
          }
          if (students.length !== new Set(students).size) {
            console.log(record.fields["Email"], students);
          }
        }
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(emails.length);
      console.log(emails.join("; "));
    }
  );
