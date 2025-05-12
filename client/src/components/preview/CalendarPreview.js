import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from "@fullcalendar/core/locales/it";

import { DateTime } from "luxon";

import { AuthContext } from "../../context/AuthContext";
import { useTimeMachine } from "../../context/TimeMachineContext";

import { getEvents, getInvitedEvents } from "../../services/eventService";
import { getTasks, getInvitedTasks } from "../../services/taskService";

import TaskHandler from "../calendar/tasks/TaskHandler";

import DateUtilities from "../calendar/DateUtilities";

import "../../styles/Preview.css";

const CalendarPreview = () => {
  const calendarRef = useRef(null);
  const isInitialMount = useRef(true);

  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");

  const { time, isTimeMachineActive } = useTimeMachine();

  const [calendarRenderKey, setCalendarRenderKey] = useState(0);
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [combinedItems, setCombinedItems] = useState([]);

  const [calendarTimeZone, setCalendarTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const { convertEventTimes } = DateUtilities();

  const { checkForOverdueTasks } = TaskHandler({
    userID,
    tasks,
    setTasks,
    time,
    isTimeMachineActive,
  });

  useEffect(() => {
    if (isAuthenticated) {
      const fetchEventsAndTasks = async () => {
        try {
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

          if (isInitialMount.current) {
            isInitialMount.current = false;
            handleTriggerReRender();
            return;
          }

          const calendarApi = calendarRef.current.getApi();
          calendarApi.refetchEvents();
        } catch (error) {
          console.error("Error fetching events or tasks:", error);
        }
      };
      fetchEventsAndTasks();
    }
  }, [isAuthenticated, userID, isTimeMachineActive]);

  useEffect(() => {
    checkForOverdueTasks();
    handleTriggerReRender();
  }, [isTimeMachineActive]);

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
      ...task,
      classNames: getClassNamesForTask(task),
    }));

    // Se viene selezionata la view taskList allora utilizzo solo le task
    if (currentView === "taskList") {
      setCombinedItems(processedTasks);
    } else {
      const combined = [...processedEvents, ...processedTasks];
      setCombinedItems(combined);
    }

    const calendarApi = calendarRef.current.getApi();
    calendarApi.refetchEvents();
  }, [events, tasks, currentView]);

  const handleTriggerReRender = () => {
    setCalendarRenderKey((prevKey) => prevKey + 1);
  };

  const goToCalendar = () => {
    navigate("/calendar");
  };

  const handleViewChange = (e) => {
    handleTriggerReRender();
    setCurrentView(e.target.value);
  };

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

  return (
    <div className="calendar-preview">
      <div className="select-container">
        <div className="view-select">
          <label htmlFor="view-select">Seleziona vista:</label>
          <select
            id="view-select"
            value={currentView}
            onChange={handleViewChange}
          >
            <option value="dayGridMonth">Mensile</option>
            <option value="timeGridWeek">Settimanale</option>
            <option value="timeGridDay">Giornaliera</option>
            <option value="taskList">Task</option>
          </select>
        </div>
      </div>

      <FullCalendar
        ref={calendarRef}
        key={calendarRenderKey}
        plugins={[listPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        headerToolbar={{
          left: "",
          center: "title",
          right: "",
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
        datesSet={({ view }) => setCurrentView(view.type)}
        selectable={true}
        events={combinedItems}
        eventClick={goToCalendar}
        dateClick={goToCalendar}
        height="auto"
        now={() => DateTime.fromISO(time, { zone: "UTC" }).setZone(calendarTimeZone).toISO()}
        nowIndicator={true}
        dayMaxEventRows={2}
        eventMaxStack={3}
        locale={itLocale}
        allDayText="Giorno intero"
        dayHeaderContent={(args) => args.text.charAt(0).toUpperCase() + args.text.slice(1)}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, 
        }}
      />
      <div className="link-container">
        <Link to="/calendar" className="link">
          Vai al Calendario
        </Link>
      </div>
    </div>
  );
};

export default CalendarPreview;
