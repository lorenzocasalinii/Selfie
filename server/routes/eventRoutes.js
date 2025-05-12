import express from "express";
import {
  getEvents,
  getInvitedEvents,
  getUnavailableEvents,
  getEventById,
  createNewEvent,
  updateEvent,
  deleteEvent,
  acceptEventInvitation,
  rejectEventInvitation,
  resendEventInvitation,
  updateCompletedCycles,
  sendEventAsICalendar
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/invited", getInvitedEvents);
router.get("/unavailable", getUnavailableEvents);
router.get("/:id", getEventById);
router.post("/", createNewEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.put("/:id/accept", acceptEventInvitation);
router.put("/:id/reject", rejectEventInvitation);
router.put("/:id/resend", resendEventInvitation);
router.post("/:id/ics", sendEventAsICalendar);

router.put("/:id/completed-cycles", updateCompletedCycles);

export default router;
