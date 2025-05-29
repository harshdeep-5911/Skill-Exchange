import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '/default-avatar.png' },  // ✅ Add this
  skills: { type: [String], default: [] },
  lookingFor: { type: [String], default: [] },
  experience: { type: String, default: "" },
  portfolio: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  credits: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

UserSchema.index({ skills: 1 });
UserSchema.index({ lookingFor: 1 });

export default mongoose.model("User", UserSchema);
