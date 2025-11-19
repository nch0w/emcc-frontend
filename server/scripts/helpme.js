require("dotenv").config();
const base = require("airtable").base("appLfWD5To0qamuRu");
// base("Coaches").create(
//   [
//     {
//       fields: {
//         Name: "Benny Wang",
//         Email: "bbwang@exeter.edu",
//         "Email Verified": true,
//         "Amount Paid": 0,
//         "Amount Due": 0
//       }
//     },
//     {
//       fields: {
//         Name: "Benny Wang",
//         Email: "bbwang@exeter.edu",
//         "Email Verified": true,
//         "Amount Paid": 0,
//         "Amount Due": 0
//       }
//     }
//   ],
//   function (err, records) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     records.forEach(function (record) {
//       console.log(record.getId());
//     });
//   }
// );
// console.log("I actually like men");
