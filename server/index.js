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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", (reason) => {
    console.log("user disconnected");
  });
  socket.on("room", (data) => {
    console.log("room join");
    console.log(data);
    socket.join(data.room);
  });
  socket.on("room", (data) => {
    console.log("room join");
    console.log(data);
    socket.join(data.room);
  });
  socket.on("leave room", (data) => {
    console.log("leaving room");
    console.log(data);
    socket.leave(data.room);
  });
  const a = async () => {
    console.log("a");
  };
  setTimeout(a, 10);
  setTimeout(async function () {
    let data = await gutsgrading();
    socket.broadcast.emit("data transfer", data);
  }, 10);
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
