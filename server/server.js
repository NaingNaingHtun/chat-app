const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recepients, text }) => {
    recepients.forEach((recepient) => {
      let newRecepients = recepients.filter((r) => r !== recepient);
      newRecepients.push(id);
      socket.to(recepient).emit("receive-message", {
        recepients: newRecepients,
        sender: id,
        text,
      });
    });
  });
});

httpServer.listen(5000, () => {
  console.log("Running on http://localhost:5000");
});
