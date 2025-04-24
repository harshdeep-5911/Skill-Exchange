import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Changed from fromEmail to ObjectId
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Changed from toEmail to ObjectId
    serviceDetails: { type: String, required: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('ServiceRequest', serviceRequestSchema);
