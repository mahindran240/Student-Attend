import express from "express";
import { attendanceRules, createQrAttendance, deleteAttendance, listAttendance, listRules, markAttendance, studentSummary, updateAttendance } from "../controllers/attendanceController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.use(protect);
router.get("/", listRules, validateRequest, listAttendance);
router.get("/summary", authorize("student"), studentSummary);
router.get("/summary/:studentId", authorize("teacher", "hod"), studentSummary);
router.post("/", authorize("teacher", "hod"), attendanceRules, validateRequest, markAttendance);
router.put("/:id", authorize("teacher", "hod"), updateAttendance);
router.delete("/:id", authorize("teacher", "hod"), deleteAttendance);
router.post("/qr", authorize("teacher"), createQrAttendance);

export default router;
