import { body, query } from "express-validator";
import Attendance from "../models/Attendance.js";
import Notification from "../models/Notification.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { groupBySubject, summarizeAttendance } from "../utils/attendanceStats.js";
import { createQrPayload, generateQrCode } from "../utils/qrService.js";

export const attendanceRules = [
  body("studentId").isMongoId(),
  body("subjectId").isMongoId(),
  body("date").isISO8601(),
  body("status").isIn(["present", "absent", "late"])
];

export const listRules = [query("page").optional().isInt({ min: 1 }), query("limit").optional().isInt({ min: 1, max: 100 })];

const getTeacherProfile = async (userId) => Teacher.findOne({ user: userId });

export const listAttendance = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const filter = {};

  ["studentId", "teacherId", "subjectId", "department", "semester", "section", "status"].forEach((field) => {
    if (req.query[field]) filter[field] = req.query[field];
  });

  if (req.user.role === "student") {
    const student = await Student.findOne({ user: req.user._id });
    filter.studentId = student?._id;
  }

  if (req.user.role === "teacher") {
    const teacher = await getTeacherProfile(req.user._id);
    filter.teacherId = teacher?._id;
  }

  const [items, total] = await Promise.all([
    Attendance.find(filter)
      .populate("studentId", "rollNumber")
      .populate({ path: "studentId", populate: { path: "user", select: "name email" } })
      .populate("teacherId", "employeeId")
      .populate({ path: "teacherId", populate: { path: "user", select: "name email" } })
      .populate("subjectId", "name code")
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Attendance.countDocuments(filter)
  ]);

  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } });
});

export const markAttendance = asyncHandler(async (req, res) => {
  const teacher = await getTeacherProfile(req.user._id);
  if (!teacher && req.user.role !== "hod") {
    res.status(403);
    throw new Error("Only assigned teachers and HOD users can mark attendance.");
  }

  const student = await Student.findById(req.body.studentId).populate("user");
  const subject = await Subject.findById(req.body.subjectId);
  if (!student || !subject) {
    res.status(404);
    throw new Error("Student or subject was not found.");
  }

  const record = await Attendance.findOneAndUpdate(
    {
      studentId: student._id,
      subjectId: subject._id,
      date: new Date(req.body.date)
    },
    {
      studentId: student._id,
      teacherId: teacher?._id || req.body.teacherId,
      subjectId: subject._id,
      department: student.department,
      semester: student.semester,
      section: student.section,
      date: req.body.date,
      status: req.body.status,
      remarks: req.body.remarks || "",
      markedBy: req.user._id,
      source: req.body.source || "manual"
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (req.body.status === "absent") {
    await Notification.create({
      recipient: student.user._id,
      title: "Attendance marked absent",
      message: `You were marked absent for ${subject.name}.`,
      type: "warning"
    });
  }

  res.status(201).json(record);
});

export const updateAttendance = asyncHandler(async (req, res) => {
  const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!record) {
    res.status(404);
    throw new Error("Attendance record was not found.");
  }
  res.json(record);
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  const record = await Attendance.findByIdAndDelete(req.params.id);
  if (!record) {
    res.status(404);
    throw new Error("Attendance record was not found.");
  }
  res.json({ message: "Attendance deleted successfully." });
});

export const studentSummary = asyncHandler(async (req, res) => {
  const student = req.params.studentId
    ? await Student.findById(req.params.studentId)
    : await Student.findOne({ user: req.user._id });
  if (!student) {
    res.status(404);
    throw new Error("Student profile was not found.");
  }

  const records = await Attendance.find({ studentId: student._id }).populate("subjectId", "name code").sort({ date: -1 });
  res.json({
    overview: summarizeAttendance(records),
    subjectWise: groupBySubject(records),
    recent: records.slice(0, 10)
  });
});

export const createQrAttendance = asyncHandler(async (req, res) => {
  const teacher = await getTeacherProfile(req.user._id);
  if (!teacher) {
    res.status(403);
    throw new Error("Teacher profile is required for QR attendance.");
  }
  const payload = createQrPayload({ ...req.body, teacherId: teacher._id });
  const qrCode = await generateQrCode(payload);
  res.json({ payload, qrCode });
});
