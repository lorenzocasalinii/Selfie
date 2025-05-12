import { useEffect } from "react";
import RecurrenceHandler from "./RecurrenceHandler";

const RecurrenceForm = ({ formData, setFormData, handleChange }) => {
  const { calculateEndDateRecurrence } = RecurrenceHandler();

  // Setto la endDateRecurrence quando cambia il tipo di ricorrenza o la frequenza
  useEffect(() => {
    if (formData.startDate && formData.recurrence.type) {
      const newEndDate = calculateEndDateRecurrence(
        formData.startDate,
        formData.recurrence.type === "CUSTOM"
          ? formData.recurrence.frequency
          : formData.recurrence.type
      );

      setFormData((prev) => ({
        ...prev,
        recurrence: {
          ...prev.recurrence,
          endDate: newEndDate,
        },
      }));
    }
  }, [
    formData.startDate,
    formData.recurrence.type,
    formData.recurrence.frequency,
    formData.recurrence.interval,
  ]);

  const dayMapping = {
    Domenica: "SU",
    Lunedì: "MO",
    Martedì: "TU",
    Mercoledì: "WE",
    Giovedì: "TH",
    Venerdì: "FR",
    Sabato: "SA",
  };

  // Funzione per gestire la selezione toggle di giorni o mesi
  const handleRecurrenceToggle = (value, field) => {
    const toggleValue = field === "daysOfWeek" ? dayMapping[value] : value;
    const list = [...formData.recurrence[field]];

    if (list.includes(toggleValue)) {
      const updatedList = list.filter((item) => item !== toggleValue);

      if (updatedList.length === 0) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        recurrence: {
          ...prev.recurrence,
          [field]: updatedList,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        recurrence: {
          ...prev.recurrence,
          [field]: [...list, toggleValue],
        },
      }));
    }
  };

  const formatRecurrenceFrequency = (frequency, count) => {
    switch (frequency) {
      case "daily":
        return count > 1 ? " giorni" : " giorno";
      case "weekly":
        return count > 1 ? " settimane" : " settimana";
      case "monthly":
        return count > 1 ? " mesi" : " mese";
      case "yearly":
        return count > 1 ? " anni" : " anno";
      default:
        return "";
    }
  };

  return (
    <div className="recurrence-container">
      <div>
        <label className="form-label">Ripeti:</label>
        <select
          className="form-input"
          name="recurrence.type"
          value={formData.recurrence.type}
          onChange={handleChange}
        >
          <option value="DAILY">Ogni giorno</option>
          <option value="WEEKLY">Ogni settimana</option>
          <option value="MONTHLY">Ogni Mese</option>
          <option value="YEARLY">Ogni Anno</option>
          <option value="CUSTOM">Personalizzata</option>
        </select>
      </div>

      {formData.recurrence.type === "CUSTOM" && (
        <div>
          <div>
            <label className="form-label">Ripeti:</label>
            <select
              className="form-input"
              name="recurrence.frequency"
              value={formData.recurrence.frequency}
              onChange={handleChange}
            >
              <option value="DAILY">Giornalmente</option>
              <option value="WEEKLY">Settimanalmente</option>
              <option value="MONTHLY">Mensilmente</option>
              <option value="YEARLY">Annualmente</option>
            </select>
          </div>
          <div>
            <label className="form-label">Ogni:</label>
            <input
              className="form-input"
              type="number"
              name="recurrence.interval"
              value={formData.recurrence.interval}
              onChange={handleChange}
              min="1"
            />
            <span>
              {formatRecurrenceFrequency(
                formData.recurrence.frequency,
                formData.recurrence.interval || 1
              )}
            </span>
          </div>
          {formData.recurrence.frequency === "WEEKLY" && (
            <div>
              <label className="form-label">Di:</label>
              {[
                "Domenica",
                "Lunedì",
                "Martedì",
                "Mercoledì",
                "Giovedì",
                "Venerdì",
                "Sabato",
              ].map((day) => (
                <div key={day}>
                  <label className="checkbox-label checkbox-label-small">
                    <input
                      type="checkbox"
                      checked={formData.recurrence.daysOfWeek.includes(
                        dayMapping[day]
                      )}
                      onChange={() => handleRecurrenceToggle(day, "daysOfWeek")}
                    />
                    {day}
                  </label>
                  <br />
                </div>
              ))}
            </div>
          )}
          {formData.recurrence.frequency === "MONTHLY" && (
            <div>
              <div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recurrence.monthlyType"
                    value="daysOfMonth"
                    checked={formData.recurrence.monthlyType === "daysOfMonth"}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        recurrence: {
                          ...formData.recurrence,
                          monthlyType: "daysOfMonth",
                        },
                      })
                    }
                  />
                  Ogni
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recurrence.monthlyType"
                    value="weekdayOccurrences"
                    checked={
                      formData.recurrence.monthlyType === "weekdayOccurrences"
                    }
                    onChange={() =>
                      setFormData({
                        ...formData,
                        recurrence: {
                          ...formData.recurrence,
                          monthlyType: "weekdayOccurrences",
                        },
                      })
                    }
                  />
                  Il
                </label>
              </div>
              {formData.recurrence.monthlyType === "daysOfMonth" && (
                <div>
                  <label className="form-label">Seleziona giorno:</label>
                  <div className="form-month-days-container">
                    {[...Array(31)].map((_, dayIndex) => {
                      const day = dayIndex + 1;
                      const isSelected =
                        formData.recurrence.monthDays.includes(day);
                      return (
                        <div
                          key={day}
                          onClick={() =>
                            handleRecurrenceToggle(day, "monthDays")
                          }
                          className={`form-month-day ${
                            isSelected ? "selected" : "default"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <br />
                </div>
              )}
              {formData.recurrence.monthlyType === "weekdayOccurrences" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      className="form-input"
                      name="recurrence.ordinal"
                      value={formData.recurrence.ordinal}
                      onChange={handleChange}
                    >
                      <option value="+1">Primo</option>
                      <option value="+2">Secondo</option>
                      <option value="+3">Terzo</option>
                      <option value="+4">Quarto</option>
                      <option value="+5">Quinto</option>
                      <option value="-1">Ultimo</option>
                    </select>
                    <select
                      className="form-input"
                      name="recurrence.dayOfWeek"
                      value={formData.recurrence.dayOfWeek}
                      onChange={handleChange}
                    >
                      <option value="sunday">Domenica</option>
                      <option value="monday">Lunedì</option>
                      <option value="tuesday">Martedì</option>
                      <option value="wednesday">Mercoledì</option>
                      <option value="thursday">Giovedì</option>
                      <option value="friday">Venerdì</option>
                      <option value="saturday">Sabato</option>
                      <option value="day">Giorno</option>
                      <option value="weekday">Settimana lavorativa</option>
                      <option value="weekend">Weekend</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
          {formData.recurrence.frequency === "YEARLY" && (
            <div>
              <div>
                <label className="form-label">Seleziona Mese:</label>
                <div className="form-year-months-container">
                  {[
                    "GEN",
                    "FEB",
                    "MAR",
                    "APR",
                    "MAG",
                    "GIU",
                    "LUG",
                    "AGO",
                    "SET",
                    "OTT",
                    "NOV",
                    "DEC",
                  ].map((month, monthIndex) => {
                    const isSelected = formData.recurrence.yearMonths.includes(
                      monthIndex + 1
                    );
                    return (
                      <div
                        key={month}
                        onClick={() =>
                          handleRecurrenceToggle(monthIndex + 1, "yearMonths")
                        }
                        className={`form-year-month ${
                          isSelected ? "selected" : "default"
                        }`}
                      >
                        {month}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="recurrence.triggerDaysOfWeek"
                    checked={formData.recurrence.triggerDaysOfWeek}
                    onChange={handleChange}
                  />
                  <span className="checkbox-label checkbox-label-small">Giorni della settimana</span>
                </label>
              </div>
              {formData.recurrence.triggerDaysOfWeek && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      className="form-input"
                      name="recurrence.ordinal"
                      value={formData.recurrence.ordinal}
                      onChange={handleChange}
                    >
                      <option value="+1">Primo</option>
                      <option value="+2">Secondo</option>
                      <option value="+3">Terzo</option>
                      <option value="+4">Quarto</option>
                      <option value="+5">Quinto</option>
                      <option value="-1">Ultimo</option>
                    </select>
                    <select
                      className="form-input"
                      name="recurrence.dayOfWeek"
                      value={formData.recurrence.dayOfWeek}
                      onChange={handleChange}
                    >
                      <option value="sunday">Domenica</option>
                      <option value="monday">Lunedì</option>
                      <option value="tuesday">Martedì</option>
                      <option value="wednesday">Mercoledì</option>
                      <option value="thursday">Giovedì</option>
                      <option value="friday">Venerdì</option>
                      <option value="saturday">Sabato</option>
                      <option value="day">Giorno</option>
                      <option value="weekday">Settimana lavorativa</option>
                      <option value="weekend">Weekend</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div>
        <label className="form-label">Fine ripetizione:</label>
        <select
          className="form-input"
          name="recurrence.endCondition"
          value={formData.recurrence.endCondition}
          onChange={handleChange}
        >
          <option value="never">Mai</option>
          <option value="onDate">Il giorno X</option>
          <option value="afterOccurrences">Dopo X volte</option>
        </select>
      </div>
      {formData.recurrence.endCondition === "onDate" && (
        <div>
          <label className="form-label">Fine ricorrenza:</label>
          <input
            className="form-input"
            type="date"
            name="recurrence.endDate"
            value={formData.recurrence.endDate}
            onChange={handleChange}
          />
        </div>
      )}
      {formData.recurrence.endCondition === "afterOccurrences" && (
        <div>
          <label className="form-label">Numero di ripetizioni:</label>
          <input
            className="form-input"
            type="number"
            name="recurrence.endOccurrences"
            value={formData.recurrence.endOccurrences}
            onChange={handleChange}
            min="2"
          />
        </div>
      )}
    </div>
  );
};

export default RecurrenceForm;
