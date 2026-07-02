import Attendance from "../models/Attendance.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { summarizeAttendance } from "../utils/attendanceStats.js";

export const dashboardOverview = asyncHandler(async (req, res) => {
  if (req.user.role === "student") {
    const student = await Student.findOne({ user: req.user._id }).populate("subjects", "name code");
    const records = await Attendance.find({ studentId: student?._id }).populate("subjectId", "name code").sort({ date: -1 });
    return res.json({
      profile: student,
      stats: summarizeAttendance(records),
      subjects: student?.subjects || [],
      recentAttendance: records.slice(0, 8),
      pendingLeaves: await Leave.countDocuments({ student: student?._id, status: "pending" })
    });
  }

  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id }).populate("subjects", "name code");
    const filter = { teacherId: teacher?._id };
    return res.json({
      profile: teacher,
      totalStudents: await Student.countDocuments({ department: teacher?.department }),
      totalSubjects: teacher?.subjects?.length || 0,
      todayMarked: await Attendance.countDocuments({ ...filter, date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      pendingLeaves: await Leave.countDocuments({ status: "pending" }),
      recentAttendance: await Attendance.find(filter).populate("studentId subjectId").sort({ createdAt: -1 }).limit(8)
    });
  }

  const [users, students, teachers, departments, subjects, attendance, pendingLeaves] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Student.countDocuments(),
    Teacher.countDocuments(),
    Department.countDocuments(),
    Subject.countDocuments(),
    Attendance.find().populate("subjectId", "name code"),
    Leave.countDocuments({ status: "pending" })
  ]);

  const lowAttendance = await Promise.all(
    (await Student.find().populate("user", "name email").limit(50)).map(async (student) => {
      const records = await Attendance.find({ studentId: student._id });
      return { student, stats: summarizeAttendance(records) };
    })
  );

  res.json({
    totals: { users, students, teachers, departments, subjects, pendingLeaves },
    attendance: summarizeAttendance(attendance),
    lowAttendance: lowAttendance.filter((item) => item.stats.total > 0 && item.stats.percentage < 75)
  });
});
