import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  // console.log("a user connected");
  // console.log(socket.id);

  socket.on("message:client-to-server", (msg) => {
    // console.log("message: " + msg);

    socket.broadcast.emit("message:server-to-client", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
