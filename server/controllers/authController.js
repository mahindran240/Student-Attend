import crypto from "crypto";
import { body } from "express-validator";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { sendEmail } from "../utils/emailService.js";
import { signToken } from "../utils/token.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  phone: user.phone,
  avatar: user.avatar
});

export const loginRules = [body("email").isEmail(), body("password").isLength({ min: 8 })];
export const forgotPasswordRules = [body("email").isEmail()];
export const resetPasswordRules = [body("password").isLength({ min: 8 })];

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  user.lastLogin = new Date();
  await user.save();
  const token = signToken(user);
  res.cookie("token", token, cookieOptions);
  res.json({ token, user: sanitizeUser(user) });
});

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out successfully." });
};

export const me = (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.json({ message: "If an account exists, a password reset email has been sent." });
    return;
  }

  const rawToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your Smart Attendance password",
    text: `Reset your password using this link: ${resetUrl}`,
    html: `<p>Hello ${user.name},</p><p>Use this secure link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });

  res.json({ message: "If an account exists, a password reset email has been sent." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error("Password reset token is invalid or expired.");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful." });
});
