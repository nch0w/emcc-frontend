require("dotenv").config();
const base = require("airtable").base("appOCNJ0BSbzHwTF3");

let emails = [];

base("Coaches")
  .select({
    maxRecords: 1000
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function (record) {
        // console.log("Retrieved", record.get("Email"));
        if (
          record.fields["Competitors"] &&
          record.fields["Competitors"].length
        ) {
          emails.push(record.fields.Email);
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
