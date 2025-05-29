import mongoose from "mongoose";

const agreementSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  user1Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user2Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user1Agreed: { type: Boolean, default: false },
  user2Agreed: { type: Boolean, default: false },
}, { timestamps: true });

const Agreement = mongoose.model("Agreement", agreementSchema);
export default Agreement; // ✅ ESM export
