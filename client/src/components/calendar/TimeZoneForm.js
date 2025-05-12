import React, { useState } from "react";

const timeZones = [
  // Default
  { label: "Locale", value: Intl.DateTimeFormat().resolvedOptions().timeZone},

  { label: "Hawaii (UTC-10:00)", value: "Pacific/Honolulu" },
  { label: "Alaska (UTC-09:00)", value: "America/Anchorage" },
  { label: "Pacific Time (UTC-08:00)", value: "America/Los_Angeles" },
  { label: "Central Time (UTC-06:00)", value: "America/Chicago" },
  { label: "Eastern Time (UTC-05:00)", value: "America/New_York" },
  { label: "Brasilia Time (UTC-03:00)", value: "America/Sao_Paulo" },
  { label: "Greenwich Mean Time (UTC+00:00)", value: "UTC" },
  { label: "Central European Time (UTC+01:00)", value: "Europe/Berlin" },
  { label: "Eastern European Time (UTC+02:00)", value: "Europe/Athens" },
  { label: "Moscow Standard Time (UTC+03:00)", value: "Europe/Moscow" },
  { label: "India Standard Time (UTC+05:30)", value: "Asia/Kolkata" },
  { label: "Japan Standard Time (UTC+09:00)", value: "Asia/Tokyo" },
  { label: "Australian Eastern Time (UTC+10:00)", value: "Australia/Sydney" },
];

const TimeZoneForm = ({ initialTimeZone, onSubmit }) => {
  const [selectedTimeZone, setSelectedTimeZone] = useState(initialTimeZone);

  const handleChange = (e) => {
    setSelectedTimeZone(e.target.value);
    onSubmit(e.target.value);
  };

  return (
    <div>
      <select className="form-input" value={selectedTimeZone} onChange={handleChange}>
        {timeZones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeZoneForm;
