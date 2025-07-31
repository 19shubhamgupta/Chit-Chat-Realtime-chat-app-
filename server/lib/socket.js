const { Server } = require("socket.io");
const htpp = require("http");
const express = require("express");
const group = require("../models/group");
const user = require("../models/user");

const app = express();

const server = htpp.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  const { groups } = await user.findById(userId);
  groups.forEach((grid) => {
    socket.join(grid.toString());
  });
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("A user disconnected", socket.id);
  });
});

const getreceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

module.exports = { io, app, server, getreceiverSocketId };
