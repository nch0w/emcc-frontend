require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { path: "/api/socket.io/" });

// import routes
const gutsgrading = require("./scripts/gutsGrading");
const gutscollect = require("./scripts/formsCollection");
const authRoute = require("./routes/auth");
const registrationRoute = require("./routes/registration");
const userMiddleware = require("./middleware/fetchUser");

// allow all cors requests
app.use(cors());

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(userMiddleware);

// route middlewares
app.use("/api/auth", authRoute);
app.use("/api/registration", registrationRoute);

let visitors = [];
let cachedData = [];
let schedule = 0;
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("data transfer", cachedData);
  socket.on("disconnect", (reason) => {
    console.log("user disconnected");
  });
  visitors.push(socket);
});
/*setTimeout(async function () {
  let data = await gutsgrading();
  cachedData = data;
  for (let i = 0; i < visitors.length; i++) {
    visitors[i].emit("data transfer", data);
  }
}, 10);
setInterval(async function () {
  if (schedule == 0) {
    await gutscollect(0);
    await gutscollect(1);
    await gutscollect(2);
    schedule = 1;
  } else if (schedule == 1) {
    await gutscollect(3);
    await gutscollect(4);
    await gutscollect(5);
    schedule = 2;
  } else if (schedule == 2) {
    await gutscollect(6);
    await gutscollect(7);
    let data = await gutsgrading();
    for (let i = 0; i < visitors.length; i++) {
      visitors[i].emit("data transfer", data);
    }
    schedule = 0;
  }
}, 60000);*/

server.listen(3001, () => {
  console.log("listening on *:3001");
});
