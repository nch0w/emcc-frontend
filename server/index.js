require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// import routes
const authRoute = require("./routes/auth");
const registrationRoute = require("./routes/registration");
const userMiddleware = require("./middleware/user");

// allow all cors requests
app.use(cors());

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(userMiddleware);

// route middlewares
app.use("/api/auth", authRoute);
app.use("/api/registration", registrationRoute);

app.listen(3001, () => console.log(`Up and running on port 3001`));
