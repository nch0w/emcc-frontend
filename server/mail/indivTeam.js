const transporter = require("./transporter");

// async function indivMail(emailAddress, id, students, name, zoom_link) {
//   await transporter.sendMail({
//     from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
//     to: emailAddress,
//     subject: "[EMCC] Individual Team",
//     text: "",
//     html: `
//     Hello coaches, <br /> <br />
//     Your students which have been registered as individuals in February 20th's Exeter Math Club Competition have been randomly assigned to ${name}, with team members ${students.join(
//       ", "
//     )}. Your team ID, which will be used for accessing the team rounds of the contest is ${id}. Additionally, your zoom link to be used for communication during the contest is ${zoom_link}. You should be logged into this zoom from your secondary device, while logged into the proctoring zoom (which will be sent separately) from your primary device. <br /> <br />
// Please contact exetermathclub@gmail.com with any questions or concerns, join our Discord server at https://discord.gg/DQVvFwYp to ask questions and meet other coaches and competitors. Looking forward to seeing you on contest day!<br /> <br />
// Thanks, <br />Exeter Math Club
//     `
//   });
// }

async function indivMail(emailAddress, id, students, name, zoom_link) {
  await transporter.sendMail({
    from: '"Exeter Math Club" <no-reply@exetermathclub.com>',
    to: emailAddress,
    subject: "[EMCC] Individual Team",
    text: "",
    html: `
    Hello coaches, <br /> <br />
    Your students which have been registered as individuals in February 20th's Exeter Math Club Competition have been randomly assigned to ${name}, with team members ${students.join(
      ", "
    )}. Your team ID, which will be used for accessing the team rounds of the contest is ${id}. 
<br /> <br />
    If you are not able to join our zoom link, please try coordinating with the other coaches through Google Meet or Zoom on your own. We apologize for the technical issues. Note that some individuals will not participate in the team rounds with others.
    `
  });
}

module.exports = indivMail;
