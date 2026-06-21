// Load environment variables first
require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development ease
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Attach io to app so it's accessible in controllers
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Basic API check route
app.get("/", (req, res) => {
  res.send("Restaurant Management System API is running...");
});

// Register routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));

// Socket.io Real-Time Orchestration
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Room joining: Customers join a room named by their user ID
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room for user: ${userId}`);
  });

  // Shared staff room
  socket.on("joinStaff", () => {
    socket.join("staff-room");
    console.log(`Socket ${socket.id} joined staff-room`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start Server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
