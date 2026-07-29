module.exports = {
  // airtable key in .env also needs to
  // be updated
  airtableLink: "appr0JOnxsbozw7xl",

  // registration costs
  indivEarlyCost: "$20.00",
  indivLateCost: "$20.00",
  teamEarlyCost: "$60.00",
  teamLateCost: "$60.00",

  // deadlines for registration
  registrationStarts: "November 22nd, 2024",
  earlyRegistrationDeadline: "January 5th, 2025",
  lateRegistrationDeadline: "January 20th, 2025",

  // limits on teams and individuals per coach
  maxIndivsPerCoach: -1,
  maxTeamsPerCoach: -1,
  minTeamMembersPerTeam: 2,
  maxTeamMembersPerTeam: 4,

  // booleans registrationClosed and signupClosed
  // affect the behavior of updating, creating and deleting
  // teams when coaches are logged into the portal.
  // (check registration.js to understand how)
  // by default, both are false and only need to be
  // changed in the days leading up to competition day
  registrationClosed: false,
  signupClosed: false
};
