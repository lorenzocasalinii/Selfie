import mongoose from "mongoose";
const { Schema } = mongoose;

const timeMachineSchema = new Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    isActive: {
        type: Boolean,
        required: false,
    },
  },
  {
    timestamps: true,
  }
);

const TimeMachine = mongoose.model("TimeMachine", timeMachineSchema);

export default TimeMachine;
