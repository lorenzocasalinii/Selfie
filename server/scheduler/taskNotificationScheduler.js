import User from "../models/User.js";

const urgencyIntervals = [
  0,                              // Livello 0
  7 * 24 * 60 * 60 * 1000,        // Livello 1 (+ 1 settimana)
  10 * 24 * 60 * 60 * 1000,       // Livello 2 (+ 3 giorni)
  11 * 24 * 60 * 60 * 1000,       // Livello 3 (+ 1 giorno)
  11.5 * 24 * 60 * 60 * 1000,     // Livello 4 (+ 12 ore)
];

// Scheduler per inviare le notifiche all'utente quando una task è in ritardo
const scheduleTaskNotifications = async (agenda, userID, task) => {
  try {

    if (!userID || !task || !task.extendedProps.notifications || task.extendedProps.status === "completed") {
      return;
    }

    const user = await User.findById(userID).select("-password");

    if (!user) {
      return;
    }

    const taskDeadline = new Date(task.extendedProps.deadline);
    
    // In base a quanto la task è in ritardo, viene assegnato un livello di urgenza
    for (let level = 0; level <= 4; level++) {
      if (level !== 4) {
        const nextNotificationTime = new Date(taskDeadline.getTime() + urgencyIntervals[level]);
        await agenda.schedule(nextNotificationTime, "task-notification", {
          task,
          urgencyLevel: level,
          userEmail: user.email,
        });
      
      // Quando la task arriva a livello 4, viene eseguito il job per inviare una notifica periodica ogni 12 ore
      } else {
        const recurringNotificationJob = agenda.create("task-notification", {
          task,
          urgencyLevel: level,
          userEmail: user.email,
        });
        const firstRunTime = new Date(taskDeadline.getTime() + urgencyIntervals[level - 1]);
        recurringNotificationJob.schedule(firstRunTime);
        recurringNotificationJob.repeatEvery('12 hours', { skipImmediate: true });
        await recurringNotificationJob.save();
      }
    }
    
  } catch (err) {
    console.error("Errore durante lo schedule del task notification job:", err);
  }
};

export default scheduleTaskNotifications;