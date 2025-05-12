import User from "../models/User.js";
import Event from "../models/Event.js";
import Task from "../models/Task.js";
import { generateEventEmail, generateTaskEmail } from "./generateEmail.js";
import sendEmailNotification from "../utils/sendEmailNotification.js";

const urgencyIntervals = [
  0,                              // Livello 0
  7 * 24 * 60 * 60 * 1000,        // Livello 1 (+ 1 settimana)
  10 * 24 * 60 * 60 * 1000,       // Livello 2 (+ 3 giorni)
  11 * 24 * 60 * 60 * 1000,       // Livello 3 (+ 1 giorno)
  11.5 * 24 * 60 * 60 * 1000,     // Livello 4 (+ 12 ore)
];

// Funzione 
const triggerTimeMachineNotifications = async (userID, timeMachine) => {
  try {
    if (!userID || !timeMachine) {
      return;
    }

    const user = await User.findById(userID).select("-password");

    if (!user) {
      return;
    }

    const timeMachineValue = timeMachine.time;

    const startOfDay = new Date(timeMachineValue);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(timeMachineValue);
    endOfDay.setHours(23, 59, 59, 999);

    // Estraggo gli eventi di cui mandare le notifiche
    const events = await Event.find({
      userID: userID,
      start: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    // Estraggo le attività di cui mandare le notifiche
    const tasks = await Task.find({
      userID: userID,
      start: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      "extendedProps.status": "pending",
      "extendedProps.temporary": true,
      "extendedProps.notifications": true,
      "extendedProps.isOverdue": true,
    });

    for (const event of events) {
      const eventStartTime = new Date(event.start);

      const allDayEvent = event.allDay;

      for (const notification of event.extendedProps.notifications) {
        const notificationTime = new Date(
          eventStartTime.getTime() - notification.timeBefore * 60 * 1000
        );

        const timeBefore = notification.timeBefore;

        if (
          !notification.isSent &&
          (Math.abs(notificationTime.getTime() - timeMachineValue.getTime()) <=
            30000 ||
            allDayEvent)
        ) {
          const emailMessage = generateEventEmail(event, timeBefore);

          try {
            await sendEmailNotification(
              user.email,
              `REMINDER: ${event.title}`,
              emailMessage
            );
          } catch (error) {
            console.error(`Errore durante l'invio dell'email:`, error);
          }

          if (allDayEvent) {
            break;
          }
        }
      }
    }

    for (const task of tasks) {
      const taskDeadline = new Date(task.extendedProps.deadline);
      const overdueTime = timeMachineValue - taskDeadline;

      let urgencyLevel = 0;
      if (overdueTime > 0) {
        for (let i = 0; i < urgencyIntervals.length; i++) {
          if (overdueTime >= urgencyIntervals[i]) {
            urgencyLevel = i;
          }
        }
      }

      const emailMessage = generateTaskEmail(task, urgencyLevel);

      try {
        await sendEmailNotification(
          user.email,
          `TASK IN RITARDO: ${task.title}`,
          emailMessage
        );
      } catch (error) {
        console.error(`Errore durante l'invio dell'email:`, error);
      }
    }
  } catch (err) {
    console.error("Errore durante lo schedule di notifiche:", err);
  }
};

export default triggerTimeMachineNotifications;
