import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    employeeId: { type: String, required: true, unique: true, trim: true },
    department: { type: String, required: true },
    designation: { type: String, default: "Assistant Professor" },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    sections: [{ semester: Number, section: String }]
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
