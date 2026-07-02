import { body } from "express-validator";
import Leave from "../models/Leave.js";
import Notification from "../models/Notification.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const leaveRules = [body("fromDate").isISO8601(), body("toDate").isISO8601(), body("reason").trim().isLength({ min: 5 })];

export const listLeaves = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "student") {
    const student = await Student.findOne({ user: req.user._id });
    filter.student = student?._id;
  }
  if (req.query.status) filter.status = req.query.status;
  const leaves = await Leave.find(filter)
    .populate({ path: "student", populate: { path: "user", select: "name email" } })
    .populate("reviewedBy", "name email")
    .sort({ createdAt: -1 });
  res.json(leaves);
});

export const applyLeave = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) {
    res.status(404);
    throw new Error("Student profile was not found.");
  }
  const leave = await Leave.create({ student: student._id, ...req.body });
  res.status(201).json(leave);
});

export const reviewLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id).populate({ path: "student", populate: { path: "user" } });
  if (!leave) {
    res.status(404);
    throw new Error("Leave request was not found.");
  }
  leave.status = req.body.status;
  leave.reviewNote = req.body.reviewNote || "";
  leave.reviewedBy = req.user._id;
  await leave.save();

  await Notification.create({
    recipient: leave.student.user._id,
    title: `Leave ${leave.status}`,
    message: leave.reviewNote || `Your leave request has been ${leave.status}.`,
    type: leave.status === "approved" ? "success" : "danger"
  });

  res.json(leave);
});
