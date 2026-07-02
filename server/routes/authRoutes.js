import express from "express";
import { forgotPassword, forgotPasswordRules, login, loginRules, logout, me, resetPassword, resetPasswordRules } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/login", loginRules, validateRequest, login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.post("/forgot-password", forgotPasswordRules, validateRequest, forgotPassword);
router.post("/reset-password/:token", resetPasswordRules, validateRequest, resetPassword);

export default router;
