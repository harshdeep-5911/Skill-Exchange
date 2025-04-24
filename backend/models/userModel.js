import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Define your schema here
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: [String],
  experience: String,
  portfolio: String,
  verified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
