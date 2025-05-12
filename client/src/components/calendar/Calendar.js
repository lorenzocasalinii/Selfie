import React, { useEffect, useState, useRef, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import itLocale from "@fullcalendar/core/locales/it";

import { DateTime } from "luxon";

import { AuthContext } from "../../context/AuthContext";

import TimeMachinePreview from "../preview/TimeMachinePreview";
import { useTimeMachine } from "../../context/TimeMachineContext";

import Modal from "../common/Modal";

import TimeZoneForm from "./TimeZoneForm";

import TabSwitcher from "./TabSwitcher";

import EventForm from "./events/EventForm";
import TaskForm from "./tasks/TaskForm";

import EventHandler from "./events/EventHandler";
import TaskHandler from "./tasks/TaskHandler";

import EventInfo from "./events/EventInfo";
import TaskInfo from "./tasks/TaskInfo";

import redistributePomodoroTime from "./events/EventPomodoroRedistribution";

import { getEvents, getInvitedEvents } from "../../services/eventService";
import { getTasks, getInvitedTasks } from "../../services/taskService";

import DateUtilities from "./DateUtilities";

import "../../styles/Calendar.css";
import "../../styles/Global.css"

const Calendar = () => {
  const calendarRef = useRef(null);

  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");

  const isInitialMount = useRef(true);
  const isPomodoroRedistributed = useRef(false);
  
  const [calendarRenderKey, setCalendarRenderKey] = useState(0);

  const { time, isTimeMachineActive } = useTimeMachine();

  const [convertedNow, setConvertedNow] = useState(time);

  const [calendarTimeZone, setCalendarTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [isTZFormOpen, setIsTZFormOpen] = useState(false);

  const [currentView, setCurrentView] = useState("dayGridMonth");

  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [combinedItems, setCombinedItems] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFormTab, setCurrentFormTab] = useState("event");

  const [eventFormInitialData, setEventFormInitialData] = useState({});
  const [taskFormInitialData, setTaskFormInitialData] = useState({});

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  const { decrementOneDay, roundTime, convertEventTimes } = DateUtilities();

  // Converto il valore della time machine al fuso orario del
  useEffect(() => {
    setConvertedNow(DateTime.fromISO(time, { zone: "UTC" }).setZone(calendarTimeZone).toISO());
  }, [time, calendarTimeZone]);

  // Quando viene modificato il fuso orario del calendario, forza il re-render del calendario per aggiornare il now indicator
  useEffect(() => {
    handleTriggerReRender();
  }, [calendarTimeZone]);

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (isAuthenticated && !isTimeMachineActive) {
        try {

          if (!isPomodoroRedistributed.current) {
            await redistributePomodoroTime(userID, time);
            isPomodoroRedistributed.current = true;
          }
  
          const fetchedEvents = await getEvents(userID);
          const invitedEvents = await getInvitedEvents(userID);
  
          const fetchedTasks = await getTasks(userID);
          const invitedTasks = await getInvitedTasks(userID);
  
          const convertedEvents = fetchedEvents.map((event) => ({
            ...convertEventTimes(event, calendarTimeZone),
            classNames: event.extendedProps?.markAsUnavailable ? ["background-event"] : ["standard-event"],
            display: event.extendedProps?.markAsUnavailable ? "background" : "auto",

          }));
          const convertedInvitedEvents = invitedEvents.map((event) => ({
            ...convertEventTimes(event, calendarTimeZone),
            classNames: ["invited-event"],
          }));
  
          const convertedTasks = fetchedTasks.map((task) => ({
            ...convertEventTimes(task, calendarTimeZone),
            classNames: getClassNamesForTask(task),
          }));
          const convertedInvitedTasks = invitedTasks.map((task) => ({
            ...convertEventTimes(task, calendarTimeZone),
            classNames: getClassNamesForTask(task),
          }));
  
          const combinedEvents = [...convertedEvents, ...convertedInvitedEvents];
          const combinedTasks = [...convertedTasks, ...convertedInvitedTasks];
  
          setEvents(combinedEvents);
          setTasks(combinedTasks);
  
          const combined = [...combinedEvents, ...combinedTasks];
          setCombinedItems(combined);
  
          // Aggiorna gli eventi di fullCalendar
          if (isInitialMount.current) {
            isInitialMount.current = false;
            handleTriggerReRender();
            return;
          }

          const calendarApi = calendarRef.current.getApi();
          calendarApi.refetchEvents();

        } catch (error) {
          console.error("Errore durante il recupero di eventi o task:", error);
        }
      }
    };
  
    // Chiama la funzione immediatamente quando il componente viene montato
    fetchAndSetData();
  
    // Esegui ogni 10 secondi
    const interval = setInterval(fetchAndSetData, 10000);
  
    return () => clearInterval(interval);
  }, [isAuthenticated, userID, isTimeMachineActive]);

  // Funzione per attribuire le classi CSS alle task in base a scadenza/completamento
  const getClassNamesForTask = (task) => {
    const classNames = ["task"];

    const isOverdue = task.extendedProps.isOverdue;
    const isCompleted = task.extendedProps.status === "completed";
    const completedAt = task.extendedProps.completedAt
      ? DateTime.fromISO(task.extendedProps.completedAt)
      : null;
    const deadline = DateTime.fromISO(task.extendedProps.deadline);
    const completedLate = isCompleted && completedAt && completedAt >= deadline;

    if (completedLate) {
      classNames.push("task-late");
    } else if (isCompleted) {
      classNames.push("task-completed");
    } else if (isOverdue) {
      classNames.push("task-overdue");
    } else {
      classNames.push("task-pending");
    }

    return classNames;
  };

  const {
    handleEventClick,
    handleEditEvent,
    handleDeleteEvent,
    handleExportEvent,
    handleEventFormSubmit,
    initializeEventForm,
  } = EventHandler({
    userID,
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    setSelectedOccurrence,
    setSelectedRange,
    isEditMode,
    setIsEditMode,
    setIsFormOpen,
    setEventFormInitialData,
    calendarTimeZone,
  });

  const {
    handleTaskClick,
    handleEditTask,
    handleDeleteTask,
    handleTaskFormSubmit,
    initializeTaskForm,
    markTaskAsCompleted,
    checkForOverdueTasks,
  } = TaskHandler({
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
  });

  // Quando viene aggiornato il valore della timemachine, forza il re-render del calendario
  useEffect(() => {

    // Se è la prima volta che viene montata la componente, allora salta l'esecuzione
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Invoca la funzione per controllare (lato front-end) se ci sono task in ritardo
    checkForOverdueTasks();

    // Esegue il re-render del calendario
    handleTriggerReRender();
  }, [isTimeMachineActive]);

  // Funzione che esegue il re-render del calendario
  const handleTriggerReRender = () => {
    setCalendarRenderKey((prevKey) => prevKey + 1);
  };

  // Quando vengono modificati gli state di eventi o task oppure quando viene cambiata la view del calendario, aggiorno lo state eventi di fullCalendar
  useEffect(() => {

    const processedEvents = events.map((event) => {
      const isUnavailable = event.extendedProps?.markAsUnavailable;
      const isUserEvent = event.userID === userID;
      return {
        ...convertEventTimes(event, calendarTimeZone),
        display: isUnavailable ? "background" : "auto",
        classNames: [
          isUnavailable ? "background-event" : "standard-event",
          isUserEvent ? "" : "invited-event",
        ],
      };
    });

    const processedTasks = tasks.map((task) => ({
      ...convertEventTimes(task, calendarTimeZone),
      classNames: getClassNamesForTask(task),
    }));

    // Se viene selezionata la view taskList allora utilizzo solo le task
    if (currentView === "taskList") {
      setCombinedItems(processedTasks);
    } else {
      const combined = [...processedEvents, ...processedTasks];
      setCombinedItems(combined);
    }

    // Aggiorna gli eventi di fullCalendar
    const calendarApi = calendarRef.current.getApi();
    calendarApi.refetchEvents();
  }, [events, tasks, currentView, calendarTimeZone]);

  // Funzione per gestire il click su una cella del calendario
  const handleDateClick = (info) => {

    // Estraggo data e ora della cella cliccata
    const startDateTime = info.dateStr;

    // Inizializzo il form evento e task
    initializeEventForm(startDateTime);
    initializeTaskForm(startDateTime);

    if (info.allDay) {
      setEventFormInitialData((prevData) => ({
        ...prevData,
        allDay: true,
      }));
      setTaskFormInitialData((prevData) => ({
        ...prevData,
        allDay: true,
      }));
    }

    // Se clicco su un evento o una task, non aprire il form
    if (
      info.jsEvent.target.classList.contains("fc-bg-event") || 
      info.jsEvent.target.classList.contains("fc-event-title")
      ) {
      return;
    }

    setSelectedEvent(null);
    setSelectedTask(null);

    setIsEditMode(false);
    setIsFormOpen(true);
  };

  // Funzione per gestire il click su un evento o una task
  const handleItemClick = async (info) => {
    setIsFormOpen(false);
    // Estraggo il tipo di oggetto selezionato (event o task) e il suo ID
    const clickedItemType = info.event._def.extendedProps.itemType;
    const clickedItemId = info.event._def.publicId;
    
    // Setto il tab in base all'oggetto selezionato
    if (clickedItemType === "event") {
      setCurrentFormTab("event");
      handleEventClick(info, clickedItemId);
    } else {
      setCurrentFormTab("task");
      handleTaskClick(clickedItemId);
    }
  };

  // Funzione per gestire la selezione di un range di date o tempo
  const handleSelectRange = (info) => {

    // Estraggo la data e tempo iniziale e finale del range selezionato
    let startDateTime = info.startStr;
    let endDateTime = info.endStr;
    
    let allday = info.allDay;

    if (info.allDay) {
      startDateTime += "T00:00:00";
      allday = true;
    }

    setSelectedRange({
      start: startDateTime,
      end: endDateTime,
      allDay: allday,
    });
  };

  // Funzione per gestire l'aggiunta di un evento o una task dopo aver cliccato il bottone "+"
  const handleAddItem = () => {

    // Metto di default il tab del form a "event"
    setCurrentFormTab("event");
    const calendarApi = calendarRef.current.getApi();

    // Estraggo la view corrente del calendario
    const view = calendarApi.view;

    // Se sono nella view mensile o taskList, utilizzo la data e tempo corrente
    const baseDate =
      view.type === "timeGridDay" ||
      view.type === "timeGridWeek" 
      ? new Date(view.currentStart)
      : new Date(time);

    let startDateTime;

    // Se ho selezionato un range, utilizzo la data e tempo del range
    if (selectedRange) {
      initializeEventForm(selectedRange.start);
      initializeTaskForm(selectedRange.start);

      // Se ho selezionato allDay, metto a true il campo allDay dei form
      if (selectedRange.allDay) {
        setEventFormInitialData((prevData) => ({
          ...prevData,
          endDate: decrementOneDay(selectedRange.end),
          allDay: true,
        }));
        setTaskFormInitialData((prevData) => ({
          ...prevData,
          allDay: true,
        }));

      } else {
        setEventFormInitialData((prevData) => ({
          ...prevData,
          endDate: selectedRange.end.split("T")[0],
          endTime: selectedRange.end.split("T")[1].slice(0, 5),
        }));
      }

    } else {

      // Arrotondo le ore e i minuti
      baseDate.setHours(new Date(time).getHours());
      startDateTime = roundTime(baseDate).toISOString();

      initializeEventForm(startDateTime);
      initializeTaskForm(startDateTime);

      if (view.type === "dayGridMonth" || view.type === "taskList") {
        setEventFormInitialData((prevData) => ({
          ...prevData,
          allDay: true,
        }));
        setTaskFormInitialData((prevData) => ({
          ...prevData,
          allDay: true,
        }));
      }
    }

    setIsEditMode(false);
    setIsFormOpen(true);
    setSelectedRange(null);
  };

  // Variabili per indicare se l'utente sta modificando un evento o una task
  const isEventEditing = selectedEvent !== null;
  const isTaskEditing = selectedTask !== null;

  // Funzione per mostrare a schermo il form per l'aggiunta/modifica di un evento o di una task
  const renderForm = () => {
    if (currentFormTab === "event") {
      // Se il tab corrente è su "event", mostro il form per l'aggiunta/modifica di un evento
      return (
        <EventForm
          initialData={eventFormInitialData}
          onSubmit={handleEventFormSubmit}
          isEditMode={isEditMode}
        />
      );
    } else {
      // Se il tab corrente è su "task", mostro il form per l'aggiunta/modifica di una task
      return (
        <div>
          <TaskForm
            initialData={taskFormInitialData}
            onSubmit={handleTaskFormSubmit}
            isEditMode={isEditMode}
          />
        </div>
      );
    }
  };

  // Funzione per gestire il cambio di fuso orario del calendario
  const handleTZFormSubmit = (newTimeZone) => {
    setCalendarTimeZone(newTimeZone);
    setIsTZFormOpen(false);
  };

  // Aggiungo delle classi CSS per rendere la toolbar responsive
  const toolbarChunks = document.querySelectorAll(".fc-toolbar-chunk");
  if (toolbarChunks.length >= 3) {
    toolbarChunks[0].classList.add("fc-toolbar-left");
    toolbarChunks[1].classList.add("fc-toolbar-center");
    toolbarChunks[2].classList.add("fc-toolbar-right");
  }

  return (
    <>
      <div className="time-machine-button">
        <TimeMachinePreview />
      </div>
      <div className="calendar-container">

        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            if (isTaskEditing) setCurrentFormTab("task");
            else if (isEventEditing) setCurrentFormTab("event");
          }}
          title={currentFormTab === "event" ? "Evento" : "Task"}
          zIndex={1100}
        >
          <TabSwitcher
            currentFormTab={currentFormTab}
            setCurrentFormTab={setCurrentFormTab}
            disableEventTab={isTaskEditing}
            disableTaskTab={isEventEditing}
          />
          {renderForm()}
        </Modal>

        <Modal
          isOpen={!!selectedEvent}
          onClose={() => {setSelectedEvent(null); setSelectedOccurrence(null)}}
          title={"Evento"}
          zIndex={1000}
        >
          {selectedEvent && (
            <EventInfo
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
              setEvents={setEvents}
              selectedOccurrence={selectedOccurrence}
              handleEditEvent={handleEditEvent}
              handleDeleteEvent={handleDeleteEvent}
              handleExportEvent={handleExportEvent}
            />
          )}
        </Modal>

        <Modal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={"Task"}
          zIndex={1000}
        >
          {selectedTask && (
            <TaskInfo
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              setTasks={setTasks}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              markTaskAsCompleted={() => markTaskAsCompleted(selectedTask.id)}
            />
          )}
        </Modal>

        <Modal
          isOpen={isTZFormOpen}
          onClose={() => setIsTZFormOpen(false)}
          title={"Fuso Orario"}
          zIndex={1000}
        >
          <TimeZoneForm
            initialTimeZone={calendarTimeZone}
            onSubmit={handleTZFormSubmit}
          />
        </Modal>

        <FullCalendar
          ref={calendarRef}
          key={calendarRenderKey}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
            rrulePlugin,
          ]}
          initialView={currentView}
          headerToolbar={{
            left: "title",
            center: "dayGridMonth,timeGridWeek,timeGridDay,taskList",
            right: "timezone addEvent prev,today,next",
          }}
          buttonText={{
            today: "Oggi",
            month: "Mese",
            week: "Settimana",
            day: "Giorno",
            list: "Task",
          }}
          customButtons={{
            addEvent: {
              text: "",
              click: handleAddItem,
            },
            timezone: {
              text: "",
              click: () => setIsTZFormOpen(true)
            }
          }}
          views={{
            taskList: {
              type: "list",
              duration: { month: 1 },
              buttonText: "Tasks",
              noEventsContent: () => (
                <div style={{ textAlign: "center", padding: "10px" }}>
                  Non ci sono task in questo periodo! 
                </div>
              ),
            },
          }}
          events={combinedItems}
          timeZone={calendarTimeZone}
          now={convertedNow}
          nowIndicator={true}
          datesSet={({ view }) => setCurrentView(view.type)}
          dateClick={handleDateClick}
          eventClick={handleItemClick}
          selectable={true}
          select={handleSelectRange}
          stickyHeaderDates={true}
          handleWindowResize={true}
          scrollTime={"08:00:00"}
          scrollTimeReset={false}
          dayMaxEventRows={4}
          eventMaxStack={3}
          height="90%"
          selectMinDistance={1}
          locale={itLocale}
          allDayText="Giorno intero"
          dayHeaderContent={(args) => args.text.charAt(0).toUpperCase() + args.text.slice(1)}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, 
          }}
        />
      </div>
    </>
  );
};

export default Calendar;
