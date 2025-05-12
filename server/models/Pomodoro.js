import mongoose from "mongoose";

const PomodoroSchema = new mongoose.Schema({
  studyTime: {
    type: Number,
    required: true,
  },
  breakTime: {
    type: Number,
    required: true,
  },
  cycles: {
    type: Number,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Pomodoro = mongoose.model("Pomodoro", PomodoroSchema);

export default Pomodoro;