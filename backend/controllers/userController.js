import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Cloudinary config

cloudinary.config({
  cloud_name: "dys69csxg",
  api_key: "858478617681359",
  api_secret: "EEUPsUFBlIHnWdSiAvseP34f8y8"
});


// ✅ Controller to get all verified users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ verified: true }); // ✅ Only verified users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};



// Existing createProfile if used elsewhere
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, experience, otp } = req.body;
    let { skills } = req.body;

    if (typeof skills === "string") {
      skills = [skills];
    }

    let portfolioUrl = "";
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "portfolios",
      });
      portfolioUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        skills,
        experience,
        portfolio: portfolioUrl,
        verified: true,
      },
      { new: true }
    );

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
