const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Enable CORS for Express
app.use(
  cors({
    origin: "*", // Allow all origins (for testing only; limit in production)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (for testing only; limit in production)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

// Test route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Event when a new user connects
io.on("connection", (socket) => {
  console.log("New user connected");

  // Event to handle user message
  socket.on("message", (data) => {
    console.log(`Message received from ${data.userName}: ${data.message}`);

    // Broadcast message to all connected users
    io.emit("message", data);
  });

  // Event when a user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server on port 4000
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

