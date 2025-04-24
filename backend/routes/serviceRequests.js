import express from "express";
import jwt from "jsonwebtoken";
import ServiceRequest from "../models/ServiceRequest.js";
import { protect } from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Send a service request
router.post("/send", protect, async (req, res) => {
  try {
    const { toEmail, serviceDetails } = req.body;
    const fromEmail = req.user.email;

    if (!toEmail || !serviceDetails) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find users by email to get their ObjectId
    const fromUser = await User.findOne({ email: fromEmail });
    const toUser = await User.findOne({ email: toEmail });

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newRequest = new ServiceRequest({
      fromUser: fromUser._id, // Use ObjectId for fromUser
      toUser: toUser._id,     // Use ObjectId for toUser
      serviceDetails,
    });
    await newRequest.save();

    req.io.emit("newServiceRequest", { toEmail });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("❌ Error in /send:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get current user's received service requests
router.get("/my-requests", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from headers

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Decode the token and find the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the correct user-related service requests are fetched
    const serviceRequests = await ServiceRequest.find({
      $or: [{ fromUser: user._id }, { toUser: user._id }],  // Match based on ObjectId
    })
      .populate("fromUser toUser");  // Populate the 'fromUser' and 'toUser' fields with user data

    // Format the response to include name and skills of the users
    const response = serviceRequests.map(request => ({
      ...request.toObject(), // Convert the request document to a plain object
      fromUser: {
        name: request.fromUser.name,
        skills: request.fromUser.skills,
      },
      toUser: {
        name: request.toUser.name,
        skills: request.toUser.skills,
      },
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error("Error in backend:", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

// ✅ Accept a service request and create chat
router.post("/accept", async (req, res) => {
  const { requestId } = req.body;
  try {
    const serviceRequest = await ServiceRequest.findById(requestId).populate("fromUser toUser"); // Populate to get full user info
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }

    serviceRequest.status = "accepted";
    await serviceRequest.save();

    // Create chat or fetch existing chat
    let chat = await Chat.findOne({
      participants: { $all: [serviceRequest.fromUser._id, serviceRequest.toUser._id] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [serviceRequest.fromUser._id, serviceRequest.toUser._id],
      });
      await chat.save();
    }

    return res.status(200).json({ chatId: chat._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to accept request" });
  }
});

// ✅ Decline a service request
router.post("/decline", protect, async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "declined";
    await request.save();

    res.status(200).json({ message: "Request declined" });
  } catch (err) {
    console.error("❌ Error in /decline:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
