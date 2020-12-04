const router = require("express").Router();
const bcrypt = require("bcryptjs");
const base = require("airtable").base("appOCNJ0BSbzHwTF3");
const crypto = require("crypto");

function genToken() {
  return crypto.randomBytes(256).toString("hex");
}

router.post("/login", async (req, res) => {
  const sessionToken = genToken();
  const { email, password } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must contain at least six characters." });
  }

  const sameEmail = await base("Coaches")
    .select({
      filterByFormula: `{Email} = '${email}'`
    })
    .firstPage();

  if (sameEmail.length == 0) {
    return res.status(400).json({
      error:
        "We couldn't find an account with this email address. Please try again."
    });
  }

  const user = sameEmail[0];
  const match = await bcrypt.compare(password, user.fields.Password);
  if (!match) {
    return res.status(400).json({ error: "Incorrect password." });
  }
  await base("Coaches").update([
    {
      id: user.id,
      fields: {
        Session: JSON.stringify([
          ...JSON.parse(user.fields.Session),
          sessionToken
        ])
      }
    }
  ]);

  const teams = [];
  const individuals = [];
  for (let competitorId of user.fields.Competitors) {
    const competitor = await base("Competitors").find(competitorId);
    if (competitor.fields.Individual) {
      individuals.push({
        student: competitor.fields["Student 1"]
      });
    } else {
      teams.push({
        name: competitor.fields.Name,
        student1: competitor.fields["Student 1"],
        student2: competitor.fields["Student 2"],
        student3: competitor.fields["Student 3"],
        student4: competitor.fields["Student 4"]
      });
    }
  }

  return res.status(200).json({
    name: user.fields["Name"],
    email: user.fields["Email"],
    sessionToken,
    id: user.id,
    coachInfo: {
      name: user.fields["Name"],
      phoneNumber: user.fields["Phone"],
      email: user.fields["Email"],
      mailingAddress: user.fields["Address"],
      teamLimit: 5,
      indivLimit: 5
    },
    teams,
    individuals
  });
});

router.post("/signup", async (req, res) => {
  const sessionToken = genToken();

  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name cannot be blank." });
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must contain at least six characters." });
  }
  const sameEmail = await base("Coaches")
    .select({
      filterByFormula: `{Email} = '${email}'`
    })
    .firstPage();
  if (sameEmail.length > 0) {
    return res
      .status(400)
      .json({ error: "This email address is already in use." });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const records = await base("Coaches").create([
    {
      fields: {
        Name: name,
        Email: email,
        Password: hashedPassword,
        Session: JSON.stringify([sessionToken])
      }
    }
  ]);
  const newUser = records[0];
  res.status(200).json({
    name: newUser.fields["Name"],
    email: newUser.fields["Email"],
    id: newUser.id,
    sessionToken
  });
});

module.exports = router;
