import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : req.cookies?.token;

  if (!token) {
    res.status(401);
    throw new Error("Authentication token is required.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || "development-secret-key");
  const user = await User.findById(decoded.id).select("-password -resetPasswordToken -resetPasswordExpires");

  if (!user || !user.isActive) {
    res.status(401);
    throw new Error("User account is not authorized.");
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("You do not have permission to access this resource.");
  }
  next();
};
