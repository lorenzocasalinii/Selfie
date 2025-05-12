import { getEvents, updateEvent, createNewEvent } from "../../../services/eventService";
import { v4 as uuidv4 } from "uuid";

const redistributePomodoroTime = async (userID, currentDate) => {
  try {
    //Ottiene elenco eventi
    const events = await getEvents(userID);

    //Ottiene lista di pomodori non completati
    const uncompletedPomodoros = events.filter((event) => {
      const { completedCycles, cycles } = event.extendedProps.pomodoroSettings || {};
      return (
        event.extendedProps.isPomodoro &&
        completedCycles < cycles &&
        new Date(event.end) < new Date(currentDate)
      );
    });

    let nextDate = new Date(currentDate);

    //Per ogni pomodoro non completato
    for (const event of uncompletedPomodoros) {
      const { studyTime, breakTime, cycles, completedCycles } = event.extendedProps.pomodoroSettings;

      //Converti minuti in HH:mm
      function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }

      //Calcola i cicli rimanenti e aggiorna la data in cui verrà riprogrammato(2 giorni dal giorno corrente)
      const remainingCycles = cycles - completedCycles;
      nextDate.setDate(nextDate.getDate() + 2);

      //Funzione che verifica se due eventi sono nello stesso giorno
      const isSameDay = (date1, date2) => {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );
      };

      //Cerca se esistono altri pomodori nel giorno stabilito
      const nextPomodorosOnDate = events.filter((event) =>
        event.extendedProps.isPomodoro && isSameDay(new Date(event.end), nextDate)
      );

      //Imposta l'orario di inizio e di fine mantenendo gli stessi orari dell'evento originale
      const start = new Date(nextDate);
      start.setHours(new Date(event.start).getHours());
      start.setMinutes(new Date(event.start).getMinutes());
      start.setSeconds(new Date(event.start).getSeconds());
      start.setMilliseconds(0);


      const durationMs = new Date(event.end) - new Date(event.start);
      const end = new Date(start.getTime() + durationMs);

      //Se non ci sono pomodori nella data stabilita creane uno nuovo
      if (nextPomodorosOnDate.length === 0) {
        const { _id, ...rest } = event;
        const newEvent = {
          ...rest,
          id: uuidv4(),
          title: event.title + ' - da recuperare',
          start: start.toISOString(),
          end: end.toISOString(),
          extendedProps: {
            ...event.extendedProps,
            pomodoroSettings: {
              ...event.extendedProps.pomodoroSettings,
              cycles: remainingCycles,
              completedCycles: 0,
            },
          },
        };
        await createNewEvent(newEvent, userID);

      } else {

        //Se esistono pomodori nella data stabilita redistribuisci il tempo
        for (const event of nextPomodorosOnDate) {
          const { studyTime: eventStudyTime, breakTime: eventBreakTime, cycles: eventCycles } = event.extendedProps.pomodoroSettings;

          //Calcola i nuovi tempi di studio e pausa bilanciandoli tra tutti gli eventi pomodoro del giorno
          const combinedStudyTime = Math.round(
            ((studyTime / nextPomodorosOnDate.length) * remainingCycles + eventStudyTime * eventCycles) /
            (remainingCycles + eventCycles)
          );

          const combinedBreakTime = Math.round(
            ((breakTime / nextPomodorosOnDate.length) * remainingCycles + eventBreakTime * eventCycles) /
            (remainingCycles + eventCycles)
          );

          //Calcola la nuova durata totale
          const totalDuration = (combinedStudyTime + combinedBreakTime) * (remainingCycles + eventCycles);

          const startDate = new Date(event.start);

          const newEndDate = new Date(startDate.getTime() + totalDuration * 60 * 1000);

          //aggiorna l'evento con i nuovi dati calcolati
          const updateOnDateEvent = {
            ...event,
            title: event.title + ' - aggiunto recupero',
            duration: minutesToTime(totalDuration),
            end: newEndDate.toISOString(),
            extendedProps: {
              ...event.extendedProps,
              pomodoroSettings: {
                studyTime: combinedStudyTime,
                breakTime: combinedBreakTime,
                cycles: remainingCycles + eventCycles,
                completedCycles: 0,
              },
            },
          };
          await updateEvent(updateOnDateEvent.id, updateOnDateEvent);
        }
      }

      //Aggiorna l'evento passato segnandolo come completato
      const updatedPastEvent = {
        ...event,
        extendedProps: {
          ...event.extendedProps,
          pomodoroSettings: {
            ...event.extendedProps.pomodoroSettings,
            completedCycles: cycles,
          },
        },
      };

      await updateEvent(updatedPastEvent.id, updatedPastEvent);
    }
  } catch (error) {
    console.error("Errore durante la ridistribuzione dei pomodori:", error);
  }
};

export default redistributePomodoroTime;
