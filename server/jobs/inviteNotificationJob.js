import sendEmailNotification from "../utils/sendEmailNotification.js";
import { DateTime } from "luxon";

// Definisco il job per mandare inviti ad eventi/task
export default (agenda) => {
  agenda.define("send-invite-email", async (job) => {
    const { user, item, invitee, type } = job.attrs.data; 
    const emailSubject = `Sei stato invitato a: ${item.title}`;
    const baseUrl = "http://localhost:8000/"; 

    // Rotte per accettare, rifiutare o reinviare l'invito
    const acceptUrl = `${baseUrl}/${type}s/${item.id}/accept?userID=${invitee.userID}`;
    const rejectUrl = `${baseUrl}/${type}s/${item.id}/reject?userID=${invitee.userID}`;
    const resendUrl = `${baseUrl}/${type}s/${item.id}/resend?userID=${invitee.userID}`;

    let emailBody = `
      <p>Ciao <strong>${user.name}</strong>,</p>
      <p>Sei stato invitato a: <strong>${item.title}</strong>.</p>`;

    // Genero il corpo della email in base evento o task
    try {
      if (type === "event") {
        const startISO = new Date(item.start).toISOString();
        const endISO = new Date(item.end).toISOString();
        const startDate = DateTime.fromISO(startISO, { zone: "UTC" });
        const endDate = DateTime.fromISO(endISO, { zone: "UTC" });
        const timeZone = item.extendedProps.timeZone;

        emailBody += `
          <p><strong>Inizio Evento</strong>: ${item.allDay
            ? startDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
            : startDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)}</p>
          <p><strong>Fine Evento</strong>: ${item.allDay
            ? endDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
            : endDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)}</p>`;
      } else if (type === "task") {
        const deadlineISO = new Date(item.extendedProps.deadline).toISOString();
        const deadline = DateTime.fromISO(deadlineISO, { zone: "UTC" });
        const timeZone = item.extendedProps.timeZone;

        emailBody += `
          <p><strong>Scadenza Task:</strong> ${item.allDay
            ? deadline.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
            : deadline.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)}</p>`;
      }

      emailBody += `
        <p>Per favore, rispondi a questo invito:</p>
        <ul>
          <li><a href="${acceptUrl}">Accetta</a></li>
          <li><a href="${rejectUrl}">Rifiuta</a></li>
          <li><a href="${resendUrl}">Reinvia promemoria più tardi</a></li>
        </ul>
      `;

      // Invio la notifica 
      await sendEmailNotification(user.email, emailSubject, emailBody);
    } catch (error) {
      console.error(`Errore durante l'invio della notifica:`, error);
    }

    // Rimuovo il job
    try {
      await job.remove();
    } catch (err) {
      console.error("Errore durante la rimozione del job:", err);
    }
  });
};
