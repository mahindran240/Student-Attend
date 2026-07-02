import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Attendance from "../models/Attendance.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import Notification from "../models/Notification.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([
    Attendance.deleteMany({}),
    Department.deleteMany({}),
    Leave.deleteMany({}),
    Notification.deleteMany({}),
    Student.deleteMany({}),
    Subject.deleteMany({}),
    Teacher.deleteMany({}),
    User.deleteMany({})
  ]);

  const hod = await User.create({ name: "Dr. Meera Sharma", email: "hod@sams.edu", password: "Password@123", role: "hod", department: "Computer Science" });
  const teacherUser = await User.create({ name: "Arjun Nair", email: "teacher@sams.edu", password: "Password@123", role: "teacher", department: "Computer Science" });
  const studentUser = await User.create({ name: "Riya Patel", email: "student@sams.edu", password: "Password@123", role: "student", department: "Computer Science" });

  await Department.create({ name: "Computer Science", code: "CSE", hod: hod._id, description: "Software engineering, AI, data systems, and web technologies." });
  const subject = await Subject.create({ name: "Web Engineering", code: "CSE401", department: "Computer Science", semester: 6, credits: 4 });
  const teacher = await Teacher.create({ user: teacherUser._id, employeeId: "T-CSE-001", department: "Computer Science", subjects: [subject._id], sections: [{ semester: 6, section: "A" }] });
  subject.teacher = teacher._id;
  await subject.save();
  const student = await Student.create({ user: studentUser._id, rollNumber: "CSE-2026-001", department: "Computer Science", semester: 6, section: "A", parentEmail: "parent@example.com", admissionYear: 2023, subjects: [subject._id] });

  const today = new Date();
  const records = Array.from({ length: 12 }, (_, index) => ({
    studentId: student._id,
    teacherId: teacher._id,
    subjectId: subject._id,
    department: student.department,
    semester: student.semester,
    section: student.section,
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - index),
    status: index % 5 === 0 ? "absent" : "present",
    remarks: index % 5 === 0 ? "Missed class" : "On time",
    markedBy: teacherUser._id
  }));

  await Attendance.insertMany(records);
  await Notification.create({ recipient: studentUser._id, title: "Welcome", message: "Your attendance dashboard is ready.", type: "success" });
  await Leave.create({ student: student._id, fromDate: today, toDate: today, reason: "Medical appointment" });

  console.log("Seed data created.");
  console.log("Logins: student@sams.edu, teacher@sams.edu, hod@sams.edu / Password@123");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
