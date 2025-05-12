import mongoose from "mongoose";
const { Schema } = mongoose;

const ExtendedPropsSchema = new Schema(
  {
    timeZone: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      required: true,
    },
    isOverdue: {
      type: Boolean,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    notifications: {
      type: Boolean,
      default: false,
    },
    temporary: {
      type: Boolean,
      default: false,
    },
    itemType: {
      type: String,
      default: "task",
    },
    invitedUsers: [
      {
        userID: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
  },
  { _id: false }
);

const taskSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => require("uuid").v4(),
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      default: "00:30",
    },
    extendedProps: {
      type: ExtendedPropsSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
