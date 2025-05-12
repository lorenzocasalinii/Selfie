import React, { useState } from "react";
import { useTimeMachine } from "../../../context/TimeMachineContext";
import RecurrenceForm from "./RecurrenceForm";
import RecurrenceHandler from "./RecurrenceHandler";
import NotificationForm from "./NotificationForm";
import UserForm from "../UserForm";
import TimeZoneForm from "../TimeZoneForm";
import ICAL from "ical.js";
import { DateTime } from "luxon";
import "../../../styles/Form.css";

const EventForm = ({ initialData, onSubmit, isEditMode }) => {
  const { parseRRule } = RecurrenceHandler();

  const { time } = useTimeMachine();
  const [areProposalsOpen, setAreProposalsOpen] = useState(true);

  const [formData, setFormData] = useState({
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  const MAX_DATE_RANGE_DAYS = 300;
  const MAX_TITLE_LENGTH = 50;
  const MAX_LOCATION_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

  // Funzione per controllare se i campi del form sono validi
  const validateForm = () => {
    const newErrors = {};
    const {
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      allDay,
      location,
      description,
      isPomodoro,
    } = formData;

    if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Il titolo puo' essere al massimo di ${MAX_TITLE_LENGTH} caratteri.`;
    }

    if (isPomodoro) {
      const { studyTime, breakTime, cycles } = formData.pomodoroSettings;
      if (!studyTime || !breakTime || !cycles) {
        newErrors.pomodoroSettings =
          "Tempo di studio, tempo di pausa e numero di cicli sono richiesti.";
      }
    }

    if (location.length > MAX_LOCATION_LENGTH) {
      newErrors.location = `La posizione puo' essere al massimo ${MAX_LOCATION_LENGTH} caratteri.`;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `La descrizione puo' essere al massimo ${MAX_DESCRIPTION_LENGTH} caratteri.`;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (new Date(startDate) > new Date(endDate)) {
      newErrors.endDate =
        "Il giorno di fine non puo' essere precedente al giorno di inizio.";
    }

    const timeDifference = endDateTime - startDateTime;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (daysDifference > MAX_DATE_RANGE_DAYS) {
      newErrors.endDate = `Un evento non puo' durare più di ${MAX_DATE_RANGE_DAYS} giorni.`;
    }

    if (!allDay && startDate === endDate && startDateTime >= endDateTime) {
      newErrors.endTime =
        "Il tempo di fine non puo' essere precedente al tempo di inizio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funzione per gestire il submit del form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const adjustedFormData = { ...formData };

      // Logica specifica per eventi Pomodoro
      if (adjustedFormData.isPomodoro) {
        adjustedFormData.pomodoroSettings.completedCycles = 0;
        adjustedFormData.allDay = false;
        adjustedFormData.pomodoroSettings = { ...formData.pomodoroSettings };
      }

      if (
        !adjustedFormData.title ||
        adjustedFormData.title.trim().length === 0
      ) {
        adjustedFormData.title = "New Event";
      }

      if (adjustedFormData.allDay) {
        const endDate = new Date(adjustedFormData.endDate);
        endDate.setDate(endDate.getDate() + 1);
        adjustedFormData.endDate = endDate.toISOString().split("T")[0];
        adjustedFormData.endTime = "00:00";
      }

      if (!adjustedFormData.isRecurring) {
        adjustedFormData.recurrence = null;
      }

      onSubmit({ ...adjustedFormData });
    }
  };

  // Funzine per gestire il cambio del fuso orario dell'evento
  const handleTimeZoneChange = (selectedTimeZone) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      timeZone: selectedTimeZone,
    }));
  };

  // Funzione per gestire i cambiamenti dei campi del form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [mainKey, subKey] = name.split(".");

    if (subKey) {
      setFormData({
        ...formData,
        [mainKey]: {
          ...formData[mainKey],
          [subKey]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    if (name === "startDate") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        endDate: value,
      }));
    }

    if (name === "endTime") {
      setAreProposalsOpen(true)
    }

    if (name === "startTime") {
      const [hours, minutes] = value.split(":").map(Number);
      const newHours = (hours + 1) % 24;
      const updatedValue = `${newHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      setFormData((prevFormData) => ({
        ...prevFormData,
        endTime: updatedValue,
      }));
    }
  };

  const handleChangePomodoroSettings = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const updatedPomodoroSettings = {
        ...prevFormData.pomodoroSettings,
        [name]: value,
      };

      const { studyTime, breakTime, cycles } = updatedPomodoroSettings;

      const study = parseInt(studyTime, 10) || 0;
      const breakDuration = parseInt(breakTime, 10) || 0;
      const cycleCount = parseInt(cycles, 10) || 0;

      const [startHours, startMinutes] = formData.startTime
        .split(":")
        .map((value) => parseInt(value, 10));

      const totalMinutesToAdd = (study + breakDuration) * cycleCount;

      const newTotalMinutes = startMinutes + totalMinutesToAdd;
      const endHours = (startHours + Math.floor(newTotalMinutes / 60)) % 24;
      const endMinutes = newTotalMinutes % 60;

      const formattedEndTime = `${endHours
        .toString()
        .padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

      return {
        //capisci ben perchè
        ...prevFormData,
        pomodoroSettings: updatedPomodoroSettings,
        endTime: formattedEndTime,
      };
    });
  };

  // Funzione per gestire il reset dei cambiamenti del form
  const handleResetChanges = () => {
    setFormData({ ...initialData });
  };

  // Funzione per gestire l'import di un evento da un file iCalendar
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target.result;

        try {
          const parsedData = ICAL.parse(fileContent);
          const component = new ICAL.Component(parsedData);
          const vevent = component.getFirstSubcomponent("vevent");
          const eventData = new ICAL.Event(vevent);

          const start = DateTime.fromISO(
            new Date(eventData.startDate).toISOString(),
            { zone: "UTC" }
          )
            .setZone(formData.timeZone)
            .toISO();
          const end = DateTime.fromISO(
            new Date(eventData.endDate).toISOString(),
            { zone: "UTC" }
          )
            .setZone(formData.timeZone)
            .toISO();

          const startDate = start.split("T")[0];
          const startTime = start.split("T")[1]?.slice(0, 5);
          const endDate = end.split("T")[0];
          const endTime = end.split("T")[1]?.slice(0, 5);

          const isAllDay = startTime === "00:00" && endTime === "00:00";

          const adjustedEndDate = isAllDay
            ? DateTime.fromISO(endDate).minus({ days: 1 }).toISODate()
            : endDate;

          const rrule = vevent.getFirstPropertyValue("rrule");

          let recurrence = null;
          if (rrule) {
            const rruleString = new ICAL.Recur(rrule).toString();

            recurrence = parseRRule(rruleString, false, start);
          }

          setFormData((prevFormData) => ({
            ...prevFormData,
            title: eventData.summary || "Imported Event",
            allDay: isAllDay,
            startDate: startDate,
            startTime: startTime,
            endDate: adjustedEndDate,
            endTime: endTime,
            location: eventData.location || "",
            description: eventData.description || "",
            isRecurring: !!rrule,
            recurrence: recurrence,
          }));

          setErrors({});
        } catch (error) {
          console.error(
            "Errore durante l'importazione dell'evento iCalendar:",
            error
          );
          setErrors((prevErrors) => ({
            ...prevErrors,
            file: "Errore durante l'importazione dell'evento iCalendar.",
          }));
        }
      };

      reader.readAsText(file);
    }
  };

  // Funzione per calcolare le proposte di studio
  const calculateProposals = () => {
    const startTime = new Date(`${formData.startDate}T${formData.startTime}`);
    let endTime = new Date(`${formData.startDate}T${formData.endTime}`);

    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    const totalMinutes = Math.floor((endTime - startTime) / 60000);

    const breakTime = Math.floor(totalMinutes * 0.2);
    const studyTime = totalMinutes - breakTime;
    return [
      { study: studyTime, break: breakTime, cycles: 1 },
      {
        study: Math.floor(studyTime / 2),
        break: Math.floor(breakTime / 2),
        cycles: 2,
      },
      {
        study: Math.floor(studyTime / 3),
        break: Math.floor(breakTime / 3),
        cycles: 3,
      },
    ];
  };

  // Funzione per selezionare una proposta Pomodoro
  const handleProposalSelect = (proposal) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      pomodoroSettings: {
        studyTime: proposal.study,
        breakTime: proposal.break,
        cycles: proposal.cycles,
      },
    }));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Periodo non disponibile per eventi di gruppo */}
        <div>
          <label>
            <input
              type="checkbox"
              name="markAsUnavailable"
              checked={formData.markAsUnavailable}
              onChange={handleChange}
              className="checkbox-input"
            />
            <span className="checkbox-label-small">
              Segna non disponibile per eventi di gruppo
            </span>
          </label>
        </div>
        {!formData.markAsUnavailable && (
          <div>
            {/* Import evento iCalendar */}
            <div>
              <label className="form-label">Importa evento iCalendar:</label>
              <input
                type="file"
                name="icsFile"
                accept=".ics"
                onChange={handleFileChange}
                className="form-input"
              />
            </div>
            {/* Titolo */}
            <div>
              <label className="form-label">Titolo:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Inserisci titolo"
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>
            {/* Pomodoro */}
            <div>
              <label>
                <input
                  type="checkbox"
                  name="isPomodoro"
                  checked={formData.isPomodoro}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span className="checkbox-label">Evento Pomodoro</span>
              </label>
            </div>
          </div>
        )}

        {formData.isPomodoro ? (
          <>
            {/* Campi specifici per il Pomodoro */}
            <div>
              <label>Giorno di inizio:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Orario di inizio:</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Orario di fine:</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
              
            </div>
              {errors.endTime && (
                <span className="error-message">{errors.endTime}</span>
              )}
            <div>
              <label>
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                />
                Ripeti:
              </label>
            </div>
            {formData.isRecurring && (
              <RecurrenceForm
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
              />
            )}

            {/* Sezione Proposte Pomodoro */}
            <div className="form-proposal-event">
              <div className="form-proposal-heading">
                <h3>Proposte Pomodoro</h3>
                {areProposalsOpen ? (
                  <i
                    className="bi bi-pencil-fill"
                    onClick={() => setAreProposalsOpen(false)}
                  ></i>
                ) : (
                  <i
                    className="bi bi-collection-play"
                    onClick={() => setAreProposalsOpen(true)}
                  ></i>
                )}
              </div>
              {areProposalsOpen ? (
                calculateProposals().map((proposal, index) => (
                  <button
                    className="proposal-button"
                    key={index}
                    type="button"
                    onClick={() => {
                      handleProposalSelect(proposal);
                      setAreProposalsOpen(false);
                    }}
                  >
                    <strong>Studio</strong>: {proposal.study} min,{" "}
                    <strong>Pausa</strong>: {proposal.break} min,{" "}
                    <strong>Cicli</strong>: {proposal.cycles} <br />
                  </button>
                ))
              ) : (
                <>
                  {/* Modifica manuale delle impostazioni Pomodoro */}
                  <div>
                    <label>Tempo di studio (min):</label>
                    <input
                      type="number"
                      name="studyTime"
                      value={formData.pomodoroSettings.studyTime || ""}
                      onChange={handleChangePomodoroSettings}
                      min={1}
                    />
                  </div>

                  <div>
                    <label>Tempo di pausa (min):</label>
                    <input
                      type="number"
                      name="breakTime"
                      value={formData.pomodoroSettings.breakTime || ""}
                      onChange={handleChangePomodoroSettings}
                      min={1}
                    />
                  </div>

                  <div>
                    <label>Cicli:</label>
                    <input
                      type="number"
                      name="cycles"
                      value={formData.pomodoroSettings.cycles || ""}
                      onChange={handleChangePomodoroSettings}
                      min={1}
                    />
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="primary form-submit">
              {isEditMode ? "Salva" : "Aggiungi"}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={handleResetChanges}
                className="danger"
              >
                Cancella
              </button>
            )}
          </>
        ) : (
          <div>
            {/* All Day */}
            <div>
              <label>
                <input
                  type="checkbox"
                  name="allDay"
                  checked={formData.allDay}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span className="checkbox-label">Tutto il giorno</span>
              </label>
            </div>
            <div>
              <label className="form-label">Giorno di inizio:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
                min={new Date(time).toISOString().split("T")[0]}
              />
            </div>
            {!formData.allDay && (
              <div>
                <label className="form-label">Orario di inizio:</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime || "00:00"}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            )}
            <div>
              <label className="form-label">Giorno di fine:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
                style={{
                  textDecoration:
                    formData.endDate < formData.startDate
                      ? "line-through"
                      : "none",
                }}
              />
              {errors.endDate && (
                <span className="error-message">{errors.endDate}</span>
              )}
            </div>
            {!formData.allDay && (
              <div>
                <label className="form-label">Orario di fine:</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime || "00:00"}
                  onChange={handleChange}
                  className="form-input"
                  style={{
                    textDecoration:
                      formData.startDate === formData.endDate &&
                      formData.endTime <= formData.startTime
                        ? "line-through"
                        : "none",
                  }}
                />
                {errors.endTime && (
                  <span className="error-message">{errors.endTime}</span>
                )}
              </div>
            )}
            <div>
              <label>
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span className="checkbox-label">Ripeti:</span>
              </label>
            </div>
            {formData.isRecurring && (
              <RecurrenceForm
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
              />
            )}
            {!formData.markAsUnavailable && (
              <div>
                {/* Posizione */}
                <div>
                  <label className="form-label">Posizione:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Inserisci posizione"
                  />
                  {errors.location && (
                    <span className="error-message">{errors.location}</span>
                  )}
                </div>
                {/* Descrizione */}
                <div>
                  <label className="form-label">Descrizione:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Inserisci descrizione"
                  />
                  {errors.description && (
                    <span className="error-message">{errors.description}</span>
                  )}
                </div>
                {/* Notifiche */}
                <label className="form-label">Notifiche</label>
                <NotificationForm
                  formData={formData}
                  setFormData={setFormData}
                />

                {/* Invito utenti */}
                <label className="form-label">Invita utenti</label>
                <UserForm formData={formData} setFormData={setFormData} />
              </div>
            )}

            {/* Fuso Orario */}
            <div>
              <label className="form-label">Fuso Orario:</label>
              <TimeZoneForm
                initialTimeZone={formData.timeZone}
                onSubmit={handleTimeZoneChange}
              />
            </div>
            {/* Bottone submit */}

            <button type="submit" className="primary">
              {isEditMode ? "Salva" : "Aggiungi"}
            </button>

            {/* Bottone reset (solo edit mode) */}
            {isEditMode && (
              <button
                type="button"
                onClick={handleResetChanges}
                className="danger"
              >
                Cancella
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default EventForm;
