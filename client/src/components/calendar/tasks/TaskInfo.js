import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { getUser } from "../../../services/userService";
import { handleInvitationResponse } from "../../../services/taskService"; 
import "../../../styles/TaskInfo.css";

const TaskInfo = ({
  selectedTask,
  setSelectedTask,
  setTasks,
  handleEditTask,
  handleDeleteTask,
  markTaskAsCompleted,
}) => {
  const currentUserID = localStorage.getItem("userID");
  const isOwner = selectedTask.userID === currentUserID;

  const [ownerUser, setOwnerUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentUserStatus, setCurrentUserStatus] = useState("pending");

  // Funzione per estrarre le informazioni sui partecipanti della task
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        if (!isOwner) {
          const owner = await getUser(selectedTask.userID);
          setOwnerUser(owner);
        }

        if (selectedTask.extendedProps.invitedUsers?.length > 0) {
          const users = await Promise.all(
            selectedTask.extendedProps.invitedUsers.map(async (invite) => {
              const user = await getUser(invite.userID);
              if (invite.userID === currentUserID) {
                setCurrentUserStatus(invite.status);
              }
              // Estraggo nome, email e lo stato di accettazione per il partecipante
              return user
                ? {
                    id: invite.userID,
                    name: user.name,
                    email: user.email,
                    status: invite.status,
                  }
                : null;
            })
          );
          setParticipants(users.filter(Boolean));
        }
      } catch (error) {
        console.error("Failed to fetch task data:", error);
      }
    };

    fetchTaskData();
  }, [isOwner, selectedTask]);

  const isOverdue = selectedTask.extendedProps.isOverdue;
  const isCompleted = selectedTask.extendedProps.status === "completed";

  const completedAt = selectedTask.extendedProps.completedAt
    ? DateTime.fromISO(selectedTask.extendedProps.completedAt)
    : null;
  const deadline = DateTime.fromISO(selectedTask.extendedProps.deadline);
  const completedLate = isCompleted && completedAt && completedAt >= deadline;

  const isAllDay = selectedTask.allDay;

  // Funzione per gestire la risposta all'invito
  const handleResponse = async (responseType) => {
    await handleInvitationResponse(selectedTask.id, currentUserID, responseType);
    setCurrentUserStatus(responseType === "accept" ? "accepted" : "rejected");

    if (responseType === "reject") {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== selectedTask.id)
      );
      setSelectedTask(null);
    }
  };

  const getBadgeClass = () => {
    if (completedLate) return "late";
    if (isCompleted) return "completed";
    if (isOverdue) return "overdue";
    return "pending";
  };

  return (
    <div className="task-info">
      {/* Titolo */}
      <h2 className={getBadgeClass()}>{selectedTask.title}</h2>

      {/* Deadline */}
      <p>
        <strong>Deadline:</strong>{" "}
        {isAllDay
          ? deadline.setLocale("it").toLocaleString(DateTime.DATE_SHORT)
          : deadline.setLocale("it").toLocaleString(DateTime.DATETIME_FULL)}
      </p>

      {/* All Day */}
      {isAllDay && (
        <p className="all-day-indicator">
          <strong>Intera giornata</strong>
        </p>
      )}

      {/* Notifiche */}
      <p>
        <strong>Notifiche:</strong>{" "}
        {selectedTask.extendedProps.notifications ? "attivate" : "disattivate"}
      </p>

      {/* Fuso orario */}
      {selectedTask.extendedProps?.timeZone && (
        <p>
          <strong>Fuso orario:</strong> {selectedTask.extendedProps.timeZone}
        </p>
      )}

      {/* Creatore della task */}
      {!isOwner && ownerUser && (
        <p>
          <strong>Proprietario: </strong>
          {ownerUser.name} ({ownerUser.email})
        </p>
      )}

      {/* Utenti invitati */}
      {participants.length > 0 && (
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
            <button className="primary" onClick={handleEditTask}>
              Modifica
            </button>
            <button className="danger" onClick={handleDeleteTask}>
              Elimina
            </button>
          </>
        )}
        <button
          className={isCompleted ? "pending" : "completed"}
          onClick={markTaskAsCompleted}
        >
          {isCompleted ? "Segna come non completa" : "Segna come completa"}
        </button>
      </div>
    </div>
  );
};

export default TaskInfo;
