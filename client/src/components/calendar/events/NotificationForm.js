import React, { useState, useEffect } from "react";

const NotificationForm = ({ formData, setFormData }) => {
  const [error, setError] = useState('');

  const MAX_NOTIFICATIONS = 5;

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

  // Funzione per gestire cambiamenti nel campo orario di avviso
  const handleNotificationChange = (index, field, value) => {
    const updatedNotifications = [...formData.notifications];
    updatedNotifications[index] = {
      ...updatedNotifications[index],
      [field]: value,
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      notifications: updatedNotifications,
    }));
  };

  // Funzione per aggiungere una nuova notifica
  const addNotification = () => {
    const newNotification = {
      timeBefore: 0,
      isSent: false,
    };

    if (formData.notifications.length >= MAX_NOTIFICATIONS) {
      setError('Puoi aggiungere al massimo 5 notifiche.');
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      notifications: [newNotification, ...(prevFormData.notifications || [])],
    }));
  };

  // Funzione per rimuovere una notifica
  const removeNotification = (index) => {
    const updatedNotifications = formData.notifications.filter(
      (_, i) => i !== index
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      notifications: updatedNotifications,
    }));
  };

  // Rimuove gli errori quando il form viene aggiornato
  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [formData, error]);

  return (
    <div>
      <button
        type="button"
        className="secondary small add-notification"
        onClick={addNotification}
      >
        Aggiungi
      </button>
      <br />
      {error && (
        <span className="error-message">{error}</span>
      )}
      {/* Lista di notifiche */}
      {formData.notifications?.map((notif, index) => (
        <div key={index} className="notification-container">
          <div>
            <label className="form-label">Orario di avviso:</label>
            <select
              className="form-input"
              value={notif.timeBefore}
              onChange={(e) =>
                handleNotificationChange(index, "timeBefore", e.target.value)
              }
            >
              {Object.entries(timeOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Bottone rimuovi */}
          <button
            type="button"
            className="danger small remove-notification"
            onClick={() => removeNotification(index)}
          >
            Rimuovi
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationForm;
