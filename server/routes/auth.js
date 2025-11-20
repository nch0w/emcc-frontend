const router = require("express").Router();
const bcrypt = require("bcryptjs");
const base = require("airtable").base("appLfWD5To0qamuRu");
const crypto = require("crypto");
const updateUser = require("../middleware/updateUser");
const signUpMail = require("../mail/signup");
const resetPasswordMail = require("../mail/resetPassword");

function genToken() {
  let token = crypto.randomBytes(256).toString("hex");
  while (token.includes("rec")) {
    //for string parsing reasons we don't want the token to contain "rec"
    token = crypto.randomBytes(256).toString("hex");
  }
  return token;
}

function genVerifyToken() {
  let token = crypto.randomBytes(36).toString("hex");
  while (token.includes("rec")) {
    token = crypto.randomBytes(36).toString("hex");
  }
  return token;
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
    if (!password) {
      return res.status(400).send("Please enter a password.");
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
    // console.log(user)
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
  const { name, email, password, mail, phone } = req.body;
  const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
  if (!name || !email || !password || !mail || !phone) {
    return res.status(400).send("All fields are required.");
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

  const sameIP = await base("Coaches")
    .select({
      filterByFormula: `{IP} = '${ip}'`
    })
    .firstPage();

  if (sameIP.length >= 5) {
    return res
      .status(400)
      .send(
        "Too many signups have been made on this IP address. If you need help, please contact exetermathclub@gmail.com"
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
            Address: mail,
            Phone: phone,
            "Email Verification Token": token,
            Session: JSON.stringify([]),
            IP: ip
          }
        }
      ]);
    } else {
      records = await base("Coaches").create([
        {
          fields: {
            Name: name,
            Email: email,
            Address: mail,
            Phone: phone,
            Password: hashedPassword,
            "Email Verification Token": token,
            Session: JSON.stringify([]),
            IP: ip
          }
        }
      ]);
    }
  } catch (err) {
    console.log(err);
  }

  const newUser = records[0];
  console.log(email, token, newUser.id);
  res.status(200).json({
    name: newUser.fields["Name"],
    email: newUser.fields["Email"]
  });
  //Order swapped because timeout is 5s can't be 30s. (slower email)
  await signUpMail(email, token, newUser.id);
});

router.post("/change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!req.user)
    return res.status(400).send("Not authenticated. Please log in again.");

  const match = await bcrypt.compare(oldPassword, req.user.fields.Password);
  if (!match) {
    return res
      .status(400)
      .send(
        "Incorrect password. If you have forgotten your password, please contact exetermathclub@gmail.com"
      );
  }

  if (!newPassword || newPassword.length < 6) {
    return res
      .status(400)
      .send("New password must contain at least six characters.");
  }

  await base("Coaches").update([
    {
      id: req.user.id,
      fields: {
        Password: bcrypt.hashSync(newPassword, 10)
      }
    }
  ]);

  return res.status(200).send({});
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
      const newVerificationToken = genVerifyToken();

      await base("Coaches").update([
        {
          id: user.id,
          fields: {
            Session: JSON.stringify([
              ...JSON.parse(user.fields.Session),
              sessionToken
            ]),
            "Email Verified": true,
            "Email Verification Token": newVerificationToken
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

router.post("/sendreset", async (req, res) => {
  const { email } = req.body;
  const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
  if (!email) {
    return res.status(400).send("All fields are required.");
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).send("Please enter a valid email address.");
  }

  const sameEmail = await base("Coaches")
    .select({
      filterByFormula: `{Email} = '${email}'`
    })
    .firstPage();

  if (sameEmail.length == 0 || !sameEmail[0].fields["Email Verified"]) {
    //if the email doesn't exist or it hasn't been verified yet, dont do anything
    return res.status(200).send("good");
  }
  const token = genVerifyToken();

  let records;
  try {
    records = await base("Coaches").update([
      {
        id: sameEmail[0].id,
        fields: {
          "Email Verification Token": token,
          Session: JSON.stringify([])
        }
      }
    ]);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error updating reset token.");
  }

  const user = records[0];
  res.status(200).send("good");
  //Order swapped because timeout is 5s can't be 30s. (slower email)
  await resetPasswordMail(email, token, user.id);
});

router.post(
  "/resetpassword",
  async (req, res, next) => {
    const { tokenId, pwd } = req.body;
    if (!tokenId) {
      return res.status(400).send("Missing token.");
    }
    if (!pwd) {
      return res.status(400).send("Missing password.");
    }

    if (!pwd || pwd.length < 6) {
      return res
        .status(400)
        .send("Password must contain at least six characters.");
    }

    const recIndex = tokenId.indexOf("rec");
    if (recIndex < 0) {
      return res.status(400).send("Missing token.");
    }

    const token = tokenId.slice(0, recIndex);
    const userId = tokenId.slice(recIndex);

    try {
      const user = await base("Coaches").find(userId);

      if (user.fields["Email Verification Token"] !== token) {
        return res.status(400).send("The reset link is invalid.");
      }

      const sessionToken = genToken();
      const newVerificationToken = genVerifyToken();
      const hashedPassword = bcrypt.hashSync(pwd, 10);

      await base("Coaches").update([
        {
          id: user.id,
          fields: {
            Session: JSON.stringify([
              ...JSON.parse(user.fields.Session),
              sessionToken
            ]),
            "Email Verification Token": newVerificationToken,
            Password: hashedPassword
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

module.exports = router;
