import {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../../../services/taskService";

import DateUtilities from "../DateUtilities";

import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";

const TaskHandler = ({
  userID,
  tasks,
  setTasks,
  selectedTask,
  setSelectedTask,
  isEditMode,
  setIsEditMode,
  setIsFormOpen,
  setTaskFormInitialData,
  time,
  isTimeMachineActive,
  calendarTimeZone,
}) => {
  const { addThirtyMinutes, convertEventTimes } = DateUtilities();

  // Funzione per gestire il click su una task
  const handleTaskClick = async (clickedItemId) => {
    try {
      let clickedTask;

      // Se la time machine è attiva, recupero la task dallo state locale
      if (isTimeMachineActive) {
        clickedTask = tasks.find((task) => task.id === clickedItemId);
        if (!clickedTask) {
          console.error("Task non trovata.");
        }
      // Altrimenti le recupero dal server
      } else {
        clickedTask = await getTaskById(clickedItemId);
      }
      setSelectedTask(clickedTask);
    } catch (error) {
      console.error("Errore nel recupero della task:", error);
    }
  };

  // Funzione per gestire la modifica di una task
  const handleEditTask = () => {
    if (selectedTask) {
      // Riempo il task form con i dati della task selezionata
      setTaskFormInitialData({
        title: selectedTask.title,
        deadlineDate: DateTime.fromISO(selectedTask.start, { zone: "UTC" })
          .setZone(calendarTimeZone)
          .toISO()
          .split("T")[0],
        deadlineTime: DateTime.fromISO(selectedTask.start, { zone: "UTC" })
          .setZone(calendarTimeZone)
          .toISO()
          .split("T")[1]
          .slice(0, 5),
        allDay: selectedTask.allDay,
        notifications: selectedTask.extendedProps.notifications,
        timeZone: selectedTask.extendedProps.timeZone,
        invitedUsers: selectedTask.extendedProps.invitedUsers
      });
      setIsEditMode(true);
      setIsFormOpen(true);
    }
  };

  // Funzione per gestire la cancellazione di una task
  const handleDeleteTask = async () => {
    if (selectedTask) {
      try {
        await deleteTask(selectedTask.id);
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== selectedTask.id)
        );

        setSelectedTask(null);
      } catch (error) {
        console.error("Errore durante la cancellazione della task:", error);
      }
    }
  };

  // Funzione per gestire il submit del task form (per creazione o modifica di una task)
  const handleTaskFormSubmit = async (data) => {
    const taskTimeZone = data.timeZone;

    const now = new Date(time);
    const nowDate = now.toISOString().split("T")[0];
    const nowTime = now.toISOString().split("T")[1].slice(0, 5);
    const nowDateTime = `${nowDate}T${nowTime}:00Z`;
    
    const isAllDay = data.allDay;
    
    const deadlineDate = data.deadlineDate;
    const deadlineTime = data.deadlineTime;
    const deadlineDateTime = `${deadlineDate}T${deadlineTime}:00`;
    const isoDeadlineDateTime = DateTime.fromISO(deadlineDateTime, { zone: taskTimeZone }).toISO();
    const utcDeadlineDateTime = DateTime.fromISO(isoDeadlineDateTime, { zone: "UTC" }).toISO();
    const deadlineEndDateTime = `${addThirtyMinutes(deadlineDateTime)}`;

    const deadline = isAllDay ? deadlineDate : utcDeadlineDateTime;
    const endDeadline = isAllDay ? deadlineDate : deadlineEndDateTime;

    const current = isAllDay ? nowDate : nowDateTime;

    const isOverdue = deadline <= current;

    // Converto la deadline e la data corrente in UTC
    const utcDeadline = DateTime.fromISO(deadline, { zone: taskTimeZone }).toUTC().toISO();
    const utcEndDeadline = DateTime.fromISO(endDeadline, { zone: taskTimeZone }).toUTC().toISO();
    const utcCurrent = DateTime.fromISO(current, { zone: taskTimeZone }).toUTC().toISO();
    const utcEndCurrent = DateTime.fromISO(addThirtyMinutes(current), { zone: taskTimeZone }).toUTC().toISO();

    // Creo la nuova task con i dati inviati dal form
    const newTask = {
      id: uuidv4(),
      title: data.title,
      start: isOverdue ? utcCurrent  : utcDeadline,
      end: isOverdue ? utcEndCurrent  : utcEndDeadline,
      allDay: isAllDay,
      extendedProps: {
        status: "pending",
        isOverdue: isOverdue,
        deadline,
        notifications: data.notifications,
        timeZone: data.timeZone,
        invitedUsers: data.invitedUsers,
      },
    };

    try {
      // Se stavo modificando una task, chiamo l'API update task
      if (isEditMode) {
        const updatedTask = await updateTask(selectedTask.id, newTask);

        // Converto la task da UTC al fuso orario del calendario
        const convertedTask = convertEventTimes(updatedTask, calendarTimeZone);
        const updatedTasks = tasks.map((task) =>
          task.id === selectedTask.id ? { ...task, ...convertedTask } : task
        );

        setTasks(updatedTasks);
        setSelectedTask(updatedTask);
      } else {
        // Se stavo creando una task, chiamo l'API create task
        const createdTask = await createTask(newTask, userID);
        // Converto la task da UTC al fuso orario del calendario
        const convertedTask = convertEventTimes(createdTask, calendarTimeZone);

        setTasks([...tasks, convertedTask]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Errore durante il salvataggio della task:", error);
    }
  };

  // Funzione per inizializzare il task form in base alla data e ora selezionata
  const initializeTaskForm = (startDateTime) => {
    const startTime = startDateTime.includes("T")
      ? startDateTime.split("T")[1].slice(0, 5)
      : "00:00";
    setTaskFormInitialData({
      title: "",
      deadlineDate: startDateTime.split("T")[0],
      deadlineTime: startTime,
      allDay: false,
      notifications: false,
      timeZone: calendarTimeZone,
      invitedUsers: [],
    });
  };

  // Funzione per segnare una task come completata/non completata
  const markTaskAsCompleted = async () => {
    if (selectedTask) {
      // Prendo lo stato attuale della task
      const currentStatus = selectedTask.extendedProps.status;

      // Lo inverto
      const updatedStatus = currentStatus === "completed" ? "pending" : "completed";

      const now = new Date(time);
      const nowDate = now.toISOString().split("T")[0];
      const nowTime = now.toISOString().split("T")[1].slice(0, 5);
      const nowDateTime = `${nowDate}T${nowTime}Z`;
      const current = selectedTask.isAllDay ? nowDate : nowDateTime;

      // Controllo se la task è in ritardo
      const updatedIsOverdue =
        updatedStatus === "completed"
          ? false
          : selectedTask.extendedProps.deadline <= current;
      
      // Aggiorno il valore completedAt se la task è completata
      const updatedCompletedAt =
      updatedStatus === "completed"
        ? nowDateTime
        : null;

      // Creo la nuova task con i dati aggiornati
      const updatedTask = {
        ...selectedTask,
        extendedProps: {
          ...selectedTask.extendedProps,
          status: updatedStatus,
          isOverdue: updatedIsOverdue,
          completedAt: updatedCompletedAt,
        },
      };
      try {
        const newTask = await updateTask(selectedTask.id, updatedTask);
        setTasks([...tasks, newTask]);
        setSelectedTask(newTask);
      } catch (error) {
        console.error("Errore durante la modifica dello stato della task:", error);
      }
    }
  };

  // Funzione per aggiornare le task in ritardo a livello front-end quando viene usata la time machine
  const checkForOverdueTasks = async () => {
    const now = new Date(time);
    const nowDate = now.toISOString().split("T")[0];
    const nowTime = now.toISOString().split("T")[1].slice(0, 5);
    const nowDateTime = `${nowDate}T${nowTime}:00Z`;

    // Itero su tutte le task 
    const updatedTasks = tasks.map((task) => {
      const taskDeadline = task.extendedProps.deadline.slice(0, 16);
      const isAllDay = task.isAllDay;

      const current = isAllDay ? nowDate : nowDateTime;
      const currentEnd = isAllDay ? nowDate : `${addThirtyMinutes(nowDateTime)}`;

      const isOverdue = taskDeadline <= current;

      const isoCurrent = DateTime.fromISO(current, { zone: "UTC" }).setZone(calendarTimeZone).toISO();
      const isoCurrentEnd = DateTime.fromISO(currentEnd, { zone: "UTC" }).setZone(calendarTimeZone).toISO();

      // Controllo se una task è da segnare come in ritardo (andiamo avanti con il tempo)
      if (isOverdue && task.extendedProps.status !== "completed") {
        return {
          ...task,
          extendedProps: {
            ...task.extendedProps,
            isOverdue: true,
          },
          start: isoCurrent,
          end: isoCurrentEnd,
        };
      // Controllo se una task è da segnare come pending (andiamo indietro con il tempo)
      } else if (!isOverdue && task.extendedProps.isOverdue) {
        const startDeadline = new Date(taskDeadline);
        const endDeadline = new Date(startDeadline.getTime() + 30 * 60 * 1000);

        const taskStartDeadline = DateTime.fromISO(startDeadline, { zone: "UTC" }).setZone(calendarTimeZone).toISO();
        const taskEndDeadline = DateTime.fromISO(endDeadline, { zone: "UTC" }).setZone(calendarTimeZone).toISO();

        return {
          ...task,
          extendedProps: {
            ...task.extendedProps,
            isOverdue: false,
          },
          start: isAllDay ? taskDeadline.split("T")[0] : taskStartDeadline,
          end: isAllDay ? taskDeadline.split("T")[0] : taskEndDeadline,
        };
      }

      // Altrimenti lascio la task invariata
      return { ...task };
    });

    // Aggiorno le task 
    setTasks(updatedTasks);
    
    // Se la time machine è attiva, creo le nuove task temporanee che verranno rimosse una volta resettata la time machine
    if (isTimeMachineActive) {
      await Promise.all(
        updatedTasks.map((task) =>
          createTask({ ...task, extendedProps: { ...task.extendedProps, temporary: true }, _id: undefined, id: uuidv4() }, userID)
        ));  
    }
  };

  return {
    handleTaskClick,
    handleEditTask,
    handleDeleteTask,
    handleTaskFormSubmit,
    initializeTaskForm,
    markTaskAsCompleted,
    checkForOverdueTasks,
  };
};

export default TaskHandler;
