import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import matchRoutes from "./routes/match.js";
import serviceRequestRoutes from "./routes/serviceRequests.js";
import chatRoutes from "./routes/chat.js"; // Import chat routes

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Attach `io` to `req` so it's accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/chat", chatRoutes); // Register chat routes

app.get("/", (req, res) => {
  res.send("Freelancer Skill Exchange API is running...");
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Socket.io Events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("skillUpdated", () => {
    socket.broadcast.emit("refreshMatches");
  });

  socket.on("newServiceRequest", ({ toEmail }) => {
    socket.broadcast.emit("newServiceRequestNotification", { toEmail });
  });

  socket.on("startChat", ({ user1, user2 }) => {
    io.emit("openChat", { user1, user2 });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Server Error",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
