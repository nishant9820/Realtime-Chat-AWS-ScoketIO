const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Enable CORS for Express
app.use(
  cors({
    origin: "http://192.168.0.109:3000", // Allow your React app domain
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "http://192.168.0.109:3000", // Allow your React app domain
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

// Event when a new user connects
io.on("connection", (socket) => {
  console.log("New user connected");

  // Event to handle user message
  socket.on("message", (data) => {
    // 'data' will now contain userName and message
    console.log(`Message received from ${data.userName}: ${data.message}`);

    // Broadcast message to all connected users
    io.emit("message", data);
  });

  // Event when a user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Run server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
