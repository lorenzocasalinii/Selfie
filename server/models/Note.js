import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    default: [],
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accessList: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  visibility: {
    type: String,
    enum: ['open', 'restricted', 'private'],
    default: 'open', 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
