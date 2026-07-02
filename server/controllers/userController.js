import { body } from "express-validator";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const userRules = [
  body("name").trim().isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").optional().isLength({ min: 8 }),
  body("role").isIn(["student", "teacher", "hod"])
];

export const listUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: new RegExp(req.query.search, "i") },
      { email: new RegExp(req.query.search, "i") },
      { department: new RegExp(req.query.search, "i") }
    ];
  }
  const users = await User.find(filter).select("-password -resetPasswordToken -resetPasswordExpires").sort({ createdAt: -1 });
  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("+password");
  if (!user) {
    res.status(404);
    throw new Error("User was not found.");
  }
  ["name", "email", "phone", "avatar", "department", "isActive"].forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });
  if (req.body.password) user.password = req.body.password;
  await user.save();
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error("User was not found.");
  }
  res.json({ message: "User deactivated successfully." });
});

export const listStudents = asyncHandler(async (req, res) => {
  const filter = {};
  ["department", "semester", "section"].forEach((field) => {
    if (req.query[field]) filter[field] = req.query[field];
  });
  const students = await Student.find(filter).populate("user", "name email phone avatar department").populate("subjects", "name code");
  res.json(students);
});

export const listTeachers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.department) filter.department = req.query.department;
  const teachers = await Teacher.find(filter).populate("user", "name email phone avatar department").populate("subjects", "name code");
  res.json(teachers);
});
