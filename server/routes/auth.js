const router = require("express").Router();
const bcrypt = require("bcryptjs");
const base = require("airtable").base("appOCNJ0BSbzHwTF3");
const crypto = require("crypto");
const updateUser = require("../middleware/updateUser");
const signUpMail = require("../mail/signup");

function genToken() {
  return crypto.randomBytes(256).toString("hex");
}

function genVerifyToken() {
  return crypto.randomBytes(36).toString("hex");
}

router.post("/user", updateUser);

router.post(
  "/login",
  async (req, res, next) => {
    const sessionToken = genToken();
    const { email, password } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).send("Please enter a valid email address.");
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password must contain at least six characters.");
    }

    const sameEmail = await base("Coaches")
      .select({
        filterByFormula: `{Email} = '${email}'`
      })
      .firstPage();

    if (sameEmail.length == 0) {
      return res
        .status(400)
        .send(
          "We couldn't find an account with this email address. Please try again."
        );
    }

    const user = sameEmail[0];
    const match = await bcrypt.compare(password, user.fields.Password);
    if (!match) {
      return res.status(400).send("Incorrect password.");
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

    res
      .cookie("id", user.id, { httpOnly: true })
      .cookie("sessionToken", sessionToken, { httpOnly: true });

    req.user = user;
    next();
  },
  updateUser
);

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).send("Name cannot be blank.");
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).send("Please enter a valid email address.");
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .send("Password must contain at least six characters.");
  }
  const sameEmail = await base("Coaches")
    .select({
      filterByFormula: `{Email} = '${email}'`
    })
    .firstPage();

  if (sameEmail.length && sameEmail[0].fields["Email Verified"]) {
    return res
      .status(400)
      .send(
        "This email address is already in use. If you have forgotten your password, please contact exetermathclub@gmail.com"
      );
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  const token = genVerifyToken();
  let records;
  try {
    if (sameEmail.length) {
      records = await base("Coaches").update([
        {
          id: sameEmail[0].id,
          fields: {
            Name: name,
            Email: email,
            Password: hashedPassword,
            "Email Verification Token": token,
            Session: JSON.stringify([])
          }
        }
      ]);
    } else {
      records = await base("Coaches").create([
        {
          fields: {
            Name: name,
            Email: email,
            Password: hashedPassword,
            "Email Verification Token": token,
            Session: JSON.stringify([])
          }
        }
      ]);
    }
  } catch (err) {
    console.log(err);
  }

  const newUser = records[0];
  await signUpMail(email, token, newUser.id);
  res.status(200).json({
    name: newUser.fields["Name"],
    email: newUser.fields["Email"]
  });
});

router.post(
  "/verify",
  async (req, res, next) => {
    const { tokenId } = req.body;
    if (!tokenId) {
      res.status(400).send("Missing token.");
    }

    const recIndex = tokenId.indexOf("rec");
    if (recIndex < 0) {
      res.status(400).send("Missing token.");
    }

    const token = tokenId.slice(0, recIndex);
    const userId = tokenId.slice(recIndex);

    try {
      const user = await base("Coaches").find(userId);

      if (user.fields["Email Verified"]) {
        return res.status(400).send("Email already verified.");
      }

      if (user.fields["Email Verification Token"] !== token) {
        return res.status(400).send("Invalid verification token.");
      }

      const sessionToken = genToken();

      await base("Coaches").update([
        {
          id: user.id,
          fields: {
            Session: JSON.stringify([
              ...JSON.parse(user.fields.Session),
              sessionToken
            ]),
            "Email Verified": true
          }
        }
      ]);

      res
        .cookie("id", user.id, { httpOnly: true })
        .cookie("sessionToken", sessionToken, { httpOnly: true });

      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      return res.status(400).send("Error finding user.");
    }
  },
  updateUser
);

router.post("/logout", async (req, res) => {
  res.clearCookie("id");
  res.clearCookie("sessionToken");
  res.status(200).json();
});

module.exports = router;
