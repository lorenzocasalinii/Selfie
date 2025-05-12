import React from "react";
import "../../styles/Form.css";

const TabSwitcher = ({
  currentFormTab,
  setCurrentFormTab,
  disableEventTab,
  disableTaskTab,
}) => {
  return (
    <div className="tab-container">
      <button
        disabled={disableEventTab}
        className={currentFormTab === "event" ? "active" : "not-active"}
        onClick={() => setCurrentFormTab("event")}
      >
        Evento
      </button>
      <button
        disabled={disableTaskTab}
        className={currentFormTab === "task" ? "active" : "not-active"}
        onClick={() => setCurrentFormTab("task")}
      >
        Task
      </button>
    </div>
  );
};

export default TabSwitcher;
