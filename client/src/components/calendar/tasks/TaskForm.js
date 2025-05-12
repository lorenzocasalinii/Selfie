import React, { useState } from "react";
import UserForm from "../UserForm";
import TimeZoneForm from "../TimeZoneForm";
import "../../../styles/Form.css";

const TaskForm = ({ initialData, onSubmit, isEditMode }) => {
  const [formData, setFormData] = useState({
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  const MAX_TITLE_LENGTH = 200;

  // Funzione per controllare se i campi del form sono validi
  const validateForm = () => {
    const newErrors = {};
    const { title, deadlineDate, deadlineTime } = formData;

    if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Il titolo puo' essere al massimo di ${MAX_TITLE_LENGTH} caratteri.`;
    }

    if (!deadlineDate) {
      newErrors.deadlineDate = "Il giorno della deadline è richiesto.";
    }

    if (!deadlineTime) {
      newErrors.deadlineTime = "L'orario della deadline è richiesto.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funzione per gestire il submit del form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const adjustedFormData = { ...formData };
      if (
        !adjustedFormData.title ||
        adjustedFormData.title.trim().length === 0
      ) {
        adjustedFormData.title = "New Task";
      }

      if (adjustedFormData.allDay) {
        adjustedFormData.deadlineTime = "00:00";
      }

      onSubmit({ ...adjustedFormData });
    }
  };

  // Funzine per gestire il cambio del fuso orario della task
  const handleTimeZoneChange = (selectedTimeZone) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      timeZone: selectedTimeZone,
    }));
  };

  // Funzione per gestire i cambiamenti dei campi del form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Funzione per gestire il reset dei cambiamenti del form
  const handleResetChanges = () => {
    setFormData({ ...initialData });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
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
        {/* Giorno deadline*/}
        <div>
          <label className="form-label">Giorno Deadline:</label>
          <input
            type="date"
            name="deadlineDate"
            value={formData.deadlineDate}
            onChange={handleChange}
            className="form-input"
          />
          {errors.deadlineDate && (
            <span className="error-message">{errors.deadlineDate}</span>
          )}
        </div>
        {/* Orario Deadline */}
        {!formData.allDay && (
          <div>
            <label className="form-label">Orario Deadline</label>
            <input
              type="time"
              name="deadlineTime"
              value={formData.deadlineTime}
              onChange={handleChange}
              className="form-input"
            />
            {errors.deadlineTime && (
            <span className="error-message">{errors.deadlineTime}</span>
          )}
          </div>
        )}
        {/* Notifiche */}
        <div>
          <label>
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="checkbox-input"
            />
            <span className="checkbox-label">Invia notifiche dopo la deadline</span>
          </label>
        </div>
        {/* Invito utenti */}
        <label className="form-label">Invita utenti</label>
        <UserForm formData={formData} setFormData={setFormData} />
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
          <button type="button" onClick={handleResetChanges} className="danger">
            Cancella
          </button>
        )}
      </form>
    </div>
  );
};

export default TaskForm;
