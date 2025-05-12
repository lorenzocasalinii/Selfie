import express from "express";
import {
    updateTimeMachine,
    resetTimeMachine
} from "../controllers/timeMachineController.js";

const router = express.Router();

router.put("/update", updateTimeMachine);
router.put("/reset", resetTimeMachine);

export default router;