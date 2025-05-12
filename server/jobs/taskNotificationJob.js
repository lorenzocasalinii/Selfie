import { generateTaskEmail } from "../utils/generateEmail.js";
import sendEmailNotification from "../utils/sendEmailNotification.js";


// Definisco il job per mandare notifiche delle task
export default (agenda) => {
  agenda.define("task-notification", async (job) => {
    const { task, urgencyLevel, userEmail } = job.attrs.data;

    // Genero il messaggio email per la notifica
    const emailMessage = generateTaskEmail(task, urgencyLevel);

    // Invio la notifica via email
    try {
      await sendEmailNotification(
        userEmail,
        `TASK IN RITARDO: ${task.title}`,
        emailMessage
      );
    } catch (error) {
      console.error(`Errore durante l'invio della notifica:`, error);
    }

    // Rimuovo il job se l'urgency non è al massimo livello
    if (urgencyLevel !== 4) {
      try {
        await job.remove();
      } catch (err) {
        console.error("Errore durante la rimozione del job:", err);
      }
    }
  });
};
