const bcrypt = require("bcryptjs");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question("Enter a password: ", (password) => {
  console.log(`Hashed password: ${bcrypt.hashSync(password, 10)}`);
  readline.close();
});
