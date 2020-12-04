const base = require("airtable").base("appOCNJ0BSbzHwTF3");

async function user(req, res, next) {
  const userID = req.header("userID");
  const sessionToken = req.header("session");

  if (userID && sessionToken) {
    try {
      const user = await base("Coaches").find(userID);
      const sessions = JSON.parse(user.fields.Session);
      if (sessions.includes(sessionToken)) req.user = user;
    } catch (err) {
      console.error(err);
    }
  }
  next();
}

module.exports = user;
