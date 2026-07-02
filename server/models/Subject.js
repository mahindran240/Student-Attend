import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    credits: { type: Number, default: 3 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
