// routes/pomodoroRoutes.js
import express from "express";
import {
  createPomodoro,
  getUserPomodoros,
  sendPomodoroEmail,
} from "../controllers/pomodoroController.js";

const router = express.Router();

router.post("/", createPomodoro);

router.get("/", getUserPomodoros);

router.post("/send-email", sendPomodoroEmail);
export default router;
