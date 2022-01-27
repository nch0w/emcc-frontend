require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// import routes
const gutsgrading = require("./scripts/gutsGrading");
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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("data transfer", cachedData);
  socket.on("disconnect", (reason) => {
    console.log("user disconnected");
  });
  visitors.push(socket);
});
setTimeout(async function () {
  let data = await gutsgrading();
  cachedData = data;
  for (let i = 0; i < visitors.length; i++) {
    visitors[i].emit("data transfer", data);
  }
}, 10);
setInterval(async function () {
  let data = await gutsgrading();
  for (let i = 0; i < visitors.length; i++) {
    visitors[i].emit("data transfer", data);
  }
}, 30000);

server.listen(3001, () => {
  console.log("listening on *:3001");
});
