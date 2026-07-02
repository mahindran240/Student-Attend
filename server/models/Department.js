import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    hod: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
