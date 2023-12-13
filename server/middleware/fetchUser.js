const base = require("airtable").base("app0GDs2DUsKTI1S9");

async function user(req, res, next) {
  if (req.cookies) {
    const userID = req.cookies.id;
    const sessionToken = req.cookies.sessionToken;

    if (userID && sessionToken) {
      try {
        const user = await base("Coaches").find(userID);
        const sessions = JSON.parse(user.fields.Session);
        if (sessions.includes(sessionToken)) req.user = user;
      } catch (err) {
        console.error(err);
      }
    }
  }

  next();
}

module.exports = user;
