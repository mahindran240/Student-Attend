import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent", "late"], required: true },
    remarks: { type: String, default: "" },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, enum: ["manual", "qr", "import"], default: "manual" }
  },
  { timestamps: true }
);

attendanceSchema.index({ studentId: 1, subjectId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
