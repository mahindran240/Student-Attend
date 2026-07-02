import express from "express";
import { applyLeave, leaveRules, listLeaves, reviewLeave } from "../controllers/leaveController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.use(protect);
router.get("/", listLeaves);
router.post("/", authorize("student"), leaveRules, validateRequest, applyLeave);
router.patch("/:id/review", authorize("teacher", "hod"), reviewLeave);

export default router;
