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
  return res.status(200).json({
    name: user.fields["Name"],
    email: user.fields["Email"]
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
    email: newUser.fields["Email"]
  });
});

module.exports = router;
