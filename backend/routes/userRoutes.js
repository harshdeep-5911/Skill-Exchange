import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { protect } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.v2.config({
  cloud_name: "dys69csxg",
  api_key: "858478617681359",
  api_secret: "EEUPsUFBlIHnWdSiAvseP34f8y8",
});

// ✅ Route to get all verified users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({ verified: true });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "harshdeep7230@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}, valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) return res.status(500).json({ message: "Error sending OTP" });
      res.json({ message: "OTP sent" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create profile
router.post("/create-profile", upload.single("portfolio"), async (req, res) => {
  try {
    const { name, email, skills, experience, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp || String(user.otp) !== String(otp))
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // Upload portfolio
    let portfolioUrl = null;
    if (req.file) {
      portfolioUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });
    }

    // Handle skills
    let parsedSkills = skills;
    if (typeof skills === "string" && skills.startsWith("[")) {
      parsedSkills = JSON.parse(skills);
    }
    if (typeof parsedSkills === "string") {
      parsedSkills = [parsedSkills];
    }

    user.name = name;
    user.skills = parsedSkills;
    user.experience = experience;
    user.portfolio = portfolioUrl;
    user.verified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();
    res.json({ message: "Profile created successfully!" });
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get profile by email
router.get("/profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get currently logged-in user's info (for chat sidebar)
router.get('/me', async (req, res) => {
  try {
    const email = req.query.email; // or req.user.email if using JWT

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
