import Event from "../models/Event.js";
import { generateEventEmail } from "../utils/generateEmail.js";
import sendEmailNotification from "../utils/sendEmailNotification.js";

// Definisco il job per mandare notifiche degli eventi
export default (agenda) => {
  agenda.define("event-notification", async (job) => {
    const { event, notificationIndex, userEmail } = job.attrs.data;

    const timeBefore = event.extendedProps.notifications[notificationIndex].timeBefore;

    // Genero il messaggio email per la notifica
    const emailMessage = generateEventEmail(event, timeBefore);

    // Invio la notifica via email
    try {
      await sendEmailNotification(
        userEmail,
        `REMINDER: ${event.title}`,
        emailMessage
      );
    } catch (error) {
      console.error(`Errore durante l'invio della notifica:`, error);
    }

    // Segno come inviata la notifica
    try {
      await Event.findOneAndUpdate(
        { id: event.id },
        {
          $set: {
            [`extendedProps.notifications.${notificationIndex}.isSent`]: true,
          },
        }
      );
    } catch (err) {
      console.error("Errore durante l'aggiornamento dello stato della notifica:", err);
    }

    // Rimuovo il job
    try {
      await job.remove();
    } catch (err) {
      console.error("Errore durante la rimozione del job:", err);
    }
  });
};
