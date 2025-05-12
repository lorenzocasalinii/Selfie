import agenda from "../config/agenda.js";

// Scheduler per controllare le task in ritardo
const scheduleOverdueTasks = async () => {
  try {
    const overdueJob = await agenda.jobs({ name: "check-overdue-tasks" });
    // Se il job non esiste, lo schedulo per eseguire ogni minuto
    if (overdueJob.length === 0) {
      await agenda.every("* * * * *", "check-overdue-tasks");
    } 
  } catch (err) {
    console.error("Errore durante lo schedule dell'overdue task job:", err);
  }
};

export default scheduleOverdueTasks;