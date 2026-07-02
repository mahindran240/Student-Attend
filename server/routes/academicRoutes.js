import express from "express";
import { createResource, deleteResource, listResource, updateResource } from "../controllers/academicController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/:resource", listResource);
router.post("/:resource", authorize("hod"), createResource);
router.put("/:resource/:id", authorize("hod"), updateResource);
router.delete("/:resource/:id", authorize("hod"), deleteResource);

export default router;
