import React, { useState } from "react";
import { useTimeMachine } from "../../context/TimeMachineContext";
import "../../styles/TimeMachine.css";
import { updateTimeMachine, resetTimeMachine } from "../../services/timeMachineService";

const formatDateTime = (isoString) => {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(isoString));
};

const formatDateTimeForInput = (isoString) => {
  const date = new Date(isoString);
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const update = async (userID, newTime) => {
  try {
    await updateTimeMachine(userID, newTime);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante l'aggiornamento della time machine"
    );
  }
};

const reset = async (userID) => {
  try {
    await resetTimeMachine(userID);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il reset della time machine"
    );
  }
};

const TimeMachine = () => {
  const userID = localStorage.getItem("userID");
  const { time, setTime, isTimeMachineActive, setIsTimeMachineActive } = useTimeMachine();
  const [inputTime, setInputTime] = useState(formatDateTimeForInput(time));

  const handleInputChange = (event) => {
    const value = event.target.value;
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setInputTime(value);
    } else {
      setInputTime(formatDateTimeForInput(time));
    }
  };

  const handleUpdateTime = () => {
    const newTime = new Date(inputTime).toISOString();
    setTime(newTime);
    update(userID, newTime);
    if (isTimeMachineActive) {
      setIsTimeMachineActive(false);
      setTimeout(() => {
        setIsTimeMachineActive(true);
      }, 10);
    } else {
      setIsTimeMachineActive(true);
    }
  };

  const resetToLocalTime = () => {
    const localTime = new Date().toISOString();
    setTime(localTime);
    reset(userID);
    setIsTimeMachineActive(false);
    setInputTime(formatDateTimeForInput(localTime));
  };

  const isInputDifferent = formatDateTimeForInput(time) !== inputTime;

  return (
    <div className="time-machine">
      <p className="current-time">{formatDateTime(time)}</p>
      <div className="time-machine-controls">
        <input type="datetime-local" onChange={handleInputChange} value={inputTime} />
        {isInputDifferent && (
          <button onClick={handleUpdateTime} className="primary">Applica</button>
        )}
        <button onClick={resetToLocalTime} className="danger">Resetta</button>
      </div>
      {isTimeMachineActive ? (
        <h3>
          Time machine <span className="tm-active">attivata</span>
        </h3>
      ) : (
        <h3>
          Time machine <span className="tm-not-active">disattivata</span>
        </h3>
      )}
    </div>
  );
};

export default TimeMachine;
