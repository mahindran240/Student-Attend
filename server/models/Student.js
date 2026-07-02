import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 10 },
    section: { type: String, required: true, uppercase: true },
    parentEmail: { type: String, default: "" },
    address: { type: String, default: "" },
    admissionYear: { type: Number, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
