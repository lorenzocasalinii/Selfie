import getRecurrenceSummary from "./getRecurrenceSummary.js";
import { DateTime } from "luxon";

const loginURL = `http://localhost:3000/login`;

export const generateEventEmail = (event, timeBefore) => {

    const timeOptions = {
        0: "Quando inizia l'evento",
        5: "5 minuti prima",
        10: "10 minuti prima",
        15: "15 minuti prima",
        30: "30 minuti prima",
        60: "1 ora prima",
        120: "2 ore prima",
        1440: "1 giorno prima",
        2880: "2 giorni prima",
        10080: "1 settimana prima",
      };

        const title = event.title;
        const startISO = new Date(event.start).toISOString();
        const endISO = new Date(event.end).toISOString();
        const startDate = DateTime.fromISO(startISO, { zone: "UTC" });
        const endDate = DateTime.fromISO(endISO, { zone: "UTC" });
        const timeZone = event.extendedProps.timeZone;
        const location = event.extendedProps.location;
        const description = event.extendedProps.description;
        const allDayEvent = event.allDay;
        const rrule = event.rrule;

        const emailMessage = `
    <div>
        <p>Ciao,</p>
        <p>Questo è un promemoria che l'evento <strong>"${title}"</strong> si terrà ${
            allDayEvent ? "adesso!" : timeOptions[timeBefore]}
        </p>
        <p><strong>Dettagli Evento:</strong></p>
        <ul>
            <li><strong>Titolo:</strong> ${title}</li>
            <li><strong>Inizio:</strong> ${
                allDayEvent
                    ? startDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
                    : startDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)
            }</li>
            <li><strong>Fine:</strong> ${
                allDayEvent
                    ? endDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
                    : endDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)
            }</li>
            <li><strong>Luogo:</strong> ${location || ""}</li>
            <li><strong>Descrizione:</strong> ${description || ""}</li>
            <li><strong>Fuso Orario:</strong> ${timeZone}</li>
            ${rrule ? `<li><strong>Ripetizione:</strong> ${getRecurrenceSummary(rrule)}</li>` : ""}
        </ul>
        <p>Se hai bisogno di aggiornare o annullare questo evento, <a href="${loginURL}">accedi</a> alla tua applicazione calendario.</p>
    </div>`;

  return emailMessage;
};

export const generateTaskEmail = (task, urgencyLevel) => {
    const messages = {
        0: `<p>La task <strong>"${task.title}"</strong> è scaduta. Si prega di controllarla il prima possibile.</p>
            <p>Riceverai un'altra notifica tra una settimana se questa task rimane incompleta.</p>`,

        1: `<p>La task <strong>"${task.title}"</strong> è scaduta da più di una settimana. Si prega di intervenire al più presto.</p>
            <p>Riceverai un'altra notifica tra 3 giorni se la task non viene completata.</p>`,

        2: `<p>Questo è un promemoria che la task <strong>"${task.title}"</strong> è scaduta e richiede la tua attenzione.</p>
            <p>Riceverai un'altra notifica domani se non viene intrapresa alcuna azione.</p>`,

        3: `<p>La task <strong>"${task.title}"</strong> sta diventando sempre più urgente. Si prega di completarla immediatamente.</p>
            <p>Riceverai un'altra notifica tra 12 ore se la task rimane incompleta.</p>`,

        4: `<p>Questo è un promemoria CRITICO che la task <strong>"${task.title}"</strong> è scaduta e richiede attenzione immediata.</p>
            <p>Continuerai a ricevere notifiche ogni 12 ore fino a quando questa task non sarà completata.</p>`
    };

  const urgencyMessage = messages[urgencyLevel] + `
        <p>Per interrompere la ricezione delle notifiche, contrassegna la task come completata o disabilita le notifiche.</p>
        <p>Se hai bisogno di aggiornare o annullare questa task, <a href="${loginURL}">accedi</a> alla tua applicazione calendario.</p>`;

  const emailMessage = `
    <p>Ciao,</p>
      ${urgencyMessage}
    </div>`;

  return emailMessage;
};
