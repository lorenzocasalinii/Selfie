import { DateTime } from "luxon";
const DateUtilities = () => {

  const decrementOneDay = (date) => {
    const updatedDate = new Date(date);
    updatedDate.setDate(updatedDate.getDate() - 1);
    return updatedDate.toISOString().split("T")[0];
  };

  const roundTime = (date) => {
    const roundedDate = new Date(date);
    roundedDate.setMinutes(0);
    return roundedDate;
  };

  const addOneHour = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newHours = (hours + 1) % 24;
    return `${newHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const addThirtyMinutes = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    date.setMinutes(date.getMinutes() + 30);
    return date.toISOString();
  };

  // Funzione per convertire data e ora di un evento al fuso orario del calendario
  const convertEventTimes = (event, calendarTimeZone) => {
    const { start, end, rrule } = event;
  
    const convertedStart = DateTime.fromISO(start, { zone: "UTC" }).setZone(calendarTimeZone).toISO();
    const convertedEnd = DateTime.fromISO(end, { zone: "UTC" }).setZone(calendarTimeZone).toISO();

    let convertedRRule = rrule;

    if (rrule) {
      const rruleStartMatch = rrule.match(/DTSTART:(\d{8}T\d{6}Z)/);
      if (rruleStartMatch) {
        const updatedRRuleStart = DateTime
          .fromISO(convertedStart) 
          .setZone(calendarTimeZone)                                
          .toFormat("yyyyMMdd'T'HHmmss'Z'");       
        
        convertedRRule = rrule.replace(
          /DTSTART:\d{8}T\d{6}Z/,
          `DTSTART:${updatedRRuleStart}`
        );
      }
    }
    
    return {
      ...event,
      start: convertedStart,
      end: convertedEnd,
      rrule: convertedRRule,
    };
  };

  return {
    decrementOneDay,
    roundTime,
    addOneHour,
    addThirtyMinutes,
    convertEventTimes,
  };
};

export default DateUtilities;
