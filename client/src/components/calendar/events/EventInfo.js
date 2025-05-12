import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

import "../../../styles/EventInfo.css";
import RecurrenceHandler from "./RecurrenceHandler";
import { getUser } from "../../../services/userService";
import { handleInvitationResponse } from "../../../services/eventService";
import "../../../styles/EventInfo.css";

const EventInfo = ({
  selectedEvent,
  setSelectedEvent,
  setEvents,
  selectedOccurrence,
  handleEditEvent,
  handleDeleteEvent,
  handleExportEvent,
}) => {
  const { getRecurrenceSummary } = RecurrenceHandler();

  const { id, userID, title, start, end, allDay, rrule, extendedProps } =
    selectedEvent;
  const { location, description, timeZone, notifications, invitedUsers, markAsUnavailable } =
    extendedProps;

  const currentUserID = localStorage.getItem("userID");
  const isOwner = userID === currentUserID;

  const [ownerUser, setOwnerUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentUserStatus, setCurrentUserStatus] = useState("pending");

  // Funzione per estrarre le informazioni sui partecipanti dell'evento
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        if (!isOwner) {
          const owner = await getUser(userID);
          setOwnerUser(owner);
        }

        const user = getUser(currentUserID);
        setCurrentUser(user);

        if (invitedUsers && invitedUsers.length > 0) {
          const users = await Promise.all(
            invitedUsers.map(async (invite) => {
              const participant = await getUser(invite.userID);
              if (invite.userID === currentUserID) {
                setCurrentUserStatus(invite.status);
              }
              return participant
                ? {
                    id: invite.userID,
                    name: participant.name,
                    email: participant.email,
                    status: invite.status,
                  }
                : null;
            })
          );
          setParticipants(users.filter(Boolean));
        }
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      }
    };

    fetchParticipants();
  }, []);

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

  // Funzione per gestire la risposta all'invito
  const handleResponse = async (responseType) => {
    await handleInvitationResponse(id, currentUserID, responseType);
    setCurrentUserStatus(responseType === "accept" ? "accepted" : "rejected");

    if (responseType === "reject") {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEvent.id)
      );
      setSelectedEvent(null);
    }
  };

  return (
    <div className="event-info">
      {/* Titolo */}
      <h2 className={`${markAsUnavailable ? "unavailable" : isOwner ? "" : "invited"}`}>{title}</h2>
      
      {!rrule && (
        <>
          {/* Inizio */}
          <p>
            <strong>Inizio:</strong>{" "}
            {allDay
              ? DateTime.fromISO(start, { zone: "UTC" })
                  .setZone(timeZone)
                  .setLocale("it")
                  .toLocaleString(DateTime.DATE_SHORT)
              : DateTime.fromISO(start, { zone: "UTC" })
                  .setZone(timeZone)
                  .setLocale("it")
                  .toLocaleString(DateTime.DATETIME_FULL)}
          </p>

          {/* Fine */}
          <p>
            <strong>Fine:</strong>{" "}
            {allDay
              ? DateTime.fromISO(end, { zone: "UTC" })
                  .setZone(timeZone)
                  .setLocale("it")
                  .toLocaleString(DateTime.DATE_SHORT)
              : DateTime.fromISO(end, { zone: "UTC" })
                  .setZone(timeZone)
                  .setLocale("it")
                  .toLocaleString(DateTime.DATETIME_FULL)}
          </p>
        </>
      )}

      {/* All Day */}
      {allDay && (
        <p className="all-day-indicator">
          <strong>Intera giornata</strong>
        </p>
      )}

      {/* Posizione */}
      {location && (
        <p className="location">
          <strong>Luogo:</strong> {location}
        </p>
      )}

      {/* Descrizione */}
      {description && (
        <p className="description">
          <strong>Descrizione:</strong> {description}
        </p>
      )}

      {/* Ricorrenza */}
      {rrule && (
        <p className="recurrence">
          <strong>Ripeti:</strong> {getRecurrenceSummary(rrule)}
        </p>
      )}

      {/* Notifiche */}
      {notifications.length > 0 && (
        <div className="notifications-container">
          <h3>Notifiche:</h3>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} className="notification">
                <strong>{timeOptions[notification.timeBefore]}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fuso orario */}
      {timeZone && (
        <p className="timezone">
          <strong>Fuso Orario:</strong> {timeZone}
        </p>
      )}

      {/* Creatore dell'evento */}
      {!isOwner && ownerUser && (
        <div className="owner-info">
          <p>
            <strong>Proprietario: </strong>
            {ownerUser.name} ({ownerUser.email})
          </p>
        </div>
      )}

      {/* Utenti invitati */}
      {invitedUsers.length > 0 && (
        <div className="invited-users-container">
          <h3>Utenti invitati:</h3>
          <ul>
            {participants.map((user, index) => (
              <li key={index} className="invited-user-item">
                <div className="user-details">
                  <div>
                    <strong>{user.name}</strong>
                    <div className="user-email">{user.email}</div>{" "}
                  </div>
                </div>
                {user.id === currentUserID ? (
                  <div className="response-buttons">
                    {currentUserStatus === "pending" ? (
                      <>
                        <button
                          className="accept"
                          onClick={() => handleResponse("accept")}
                          title="Accept"
                        >
                          ✔️
                        </button>
                        <button
                          className="reject"
                          onClick={() => handleResponse("reject")}
                          title="Reject"
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <div
                        className={`status ${currentUserStatus.toLowerCase()}`}
                      >
                        {currentUserStatus}
                      </div>
                    )}
                    {currentUserStatus === "accepted" && (
                      <button
                        className="leave"
                        onClick={() => handleResponse("reject")}
                      >
                        Abbandona
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={`status ${user.status.toLowerCase()}`}>
                    {user.status}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottoni */}
      <div className="action-buttons">
        {isOwner && (
          <>
            <button className="primary" onClick={handleEditEvent}>
              Modifica
            </button>
            <button className="danger" onClick={() => handleDeleteEvent(null)}>
              Elimina
            </button>
            {selectedEvent.rrule && (
              <button
                className="danger"
                onClick={() => handleDeleteEvent(selectedOccurrence)}
              >
                Elimina istanza
              </button>
            )}
          </>
        )}
        <button className="tertiary" onClick={handleExportEvent}>
          Esporta evento
        </button>

        {selectedEvent.extendedProps.isPomodoro && (
          <div>
            <button className="go-to-pomodoro">
              <Link
                to="/pomodoro"
                state={{
                  id: selectedEvent.id,
                  title: selectedEvent.title,
                  pomodoroSettings:
                    selectedEvent.extendedProps.pomodoroSettings,
                  selectedEvent: selectedEvent,
                }}
              >
                Vai al Pomodoro
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventInfo;
