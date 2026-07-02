import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewNote: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
