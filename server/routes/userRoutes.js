import express from "express";
import { createUser, deleteUser, listStudents, listTeachers, listUsers, updateUser, userRules } from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.use(protect);
router.get("/", authorize("hod"), listUsers);
router.post("/", authorize("hod"), userRules, validateRequest, createUser);
router.put("/:id", authorize("hod"), updateUser);
router.delete("/:id", authorize("hod"), deleteUser);
router.get("/students/list", authorize("teacher", "hod"), listStudents);
router.get("/teachers/list", authorize("hod"), listTeachers);

export default router;
