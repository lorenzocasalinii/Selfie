import express from "express";
import {
  getTasks,
  getInvitedTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  acceptTaskInvitation,
  rejectTaskInvitation,
  resendTaskInvitation
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/invited", getInvitedTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.put("/:id/accept", acceptTaskInvitation);
router.put("/:id/reject", rejectTaskInvitation);
router.put("/:id/resend", resendTaskInvitation);

export default router;
