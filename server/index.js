require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// import routes
const authRoute = require("./routes/auth");

// allow all cors requests
app.use(cors());

// middlewares
app.use(express.json());

// route middlewares
app.use("/api/auth", authRoute);

app.listen(3001, () => console.log(`Up and running on port 3001`));
