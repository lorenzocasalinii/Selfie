import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  duplicateNote, 
} from "../controllers/notesController.js";

const router = express.Router();


router.post("/", createNote);
router.get("/", getNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/duplicate", duplicateNote);

export default router;
