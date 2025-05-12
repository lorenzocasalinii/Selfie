import Task from "../models/Task.js";

const addThirtyMinutes = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  date.setMinutes(date.getMinutes() + 30);
  return date.toISOString();
};

// Definisco il job per controllare le task in ritardo
export default (agenda) => {
  agenda.define("check-overdue-tasks", async () => {
    try {

      const now = new Date();
      const nowDate = now.toISOString().split("T")[0];
      const nowTime = now.toISOString().split("T")[1].slice(0, 5);
      const nowDateTime = `${nowDate}T${nowTime}:00Z`; 

      // Estraggo tutte le task in ritardo
      const tasks = await Task.find({
        "extendedProps.status": "pending",
        "extendedProps.deadline": { $lt: now },
      });

      if (tasks.length === 0) {
        return;
      }

      // Aggiorno il campo start, end e isOverdue
      for (const task of tasks) {
        const current = task.allDay ? nowDate : nowDateTime;
        const currentEnd = task.allDay ? nowDate : `${addThirtyMinutes(nowDateTime)}`;

        task.extendedProps.isOverdue = true;
        task.start = current;
        task.end = currentEnd;

        await task.save();
      }

    } catch (err) {
      console.error("Error executing OVERDUE TASK JOB:", err);
    }
  });
};
