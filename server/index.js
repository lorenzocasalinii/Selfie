import dotenv from "dotenv";
dotenv.config();

import config from "./config/config.js";
import agenda from "./config/agenda.js";

import mongoose from "mongoose";

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import pomodoroRoutes from "./routes/pomodoroRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import timeMachineRoutes from "./routes/timeMachineRoutes.js";
import scheduleOverdueTasks from "./scheduler/overdueTaskScheduler.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "client")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Registrazione delle rotte
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/time-machine", timeMachineRoutes);


app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

// Funzione per connettersi al database
const connectDB = async () => {
  try {
    await mongoose.connect(config.dbURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

// Funzione per far partire l'agenda
const startAgenda = async () => {
  try {
    await agenda.start();
    await scheduleOverdueTasks();
    console.log("Agenda workers started.");
  } catch (error) {
    console.error("Failed to start Agenda:", error.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();

    await startAgenda();

    const PORT = 8000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:8000`);
    });
  } catch (err) {
    console.error('Error during server startup:', err);
    process.exit(1);
  }
};

startServer();