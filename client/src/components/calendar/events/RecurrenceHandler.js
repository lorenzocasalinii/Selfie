import { DateTime } from "luxon";
import { RRule, rrulestr } from "rrule";

const RecurrenceHandler = () => {
  // Funzione per creare la stringa RRule
  const handleRecurrence = (recurrence, startDateTime) => {
    if (!recurrence) return null;

    const {
      type,
      frequency,
      interval,
      daysOfWeek,
      monthlyType,
      monthDays,
      ordinal,
      dayOfWeek,
      yearMonths,
      triggerDaysOfWeek,
      endCondition,
      endDate,
      endOccurrences,
    } = recurrence;

    const dayMap = {
      sunday: "SU",
      monday: "MO",
      tuesday: "TU",
      wednesday: "WE",
      thursday: "TH",
      friday: "FR",
      saturday: "SA",
      weekday: "MO,TU,WE,TH,FR",
      weekend: "SA,SU",
    };

    // Inizio
    const startDateStr = DateTime.fromISO(startDateTime, { zone: "utc" });
    const rruleStart = startDateStr.toFormat("yyyyMMdd'T'HHmmss'Z'");
    let rruleString = `DTSTART:${rruleStart}\n`;

    // Ricorrenze standard
    if (type !== "CUSTOM") {
      rruleString += `RRULE:FREQ=${type};INTERVAL=${interval}`;
    } else {
      // Ricorrenze custom
      rruleString += `RRULE:FREQ=${frequency};INTERVAL=${interval}`;

      // Settimanali
      if (frequency === "WEEKLY") {
        rruleString += `;BYDAY=${daysOfWeek
          .map((day) => day.slice(0, 2).toUpperCase())
          .join(",")}`;
      }

      // Mensili
      if (frequency === "MONTHLY") {
        if (monthlyType === "daysOfMonth") {
          rruleString += `;BYMONTHDAY=${monthDays.join(",")}`;
        }
      }
      // Annuali
      if (frequency === "YEARLY") {
        rruleString += `;BYMONTH=${yearMonths.join(",")}`;
      }

      if (
        (frequency === "MONTHLY" && monthlyType === "weekdayOccurrences") ||
        (frequency === "YEARLY" && triggerDaysOfWeek)
      ) {
        if (dayOfWeek !== "day") {
          const days = dayMap[dayOfWeek];
          rruleString += `;BYDAY=${ordinal}${days
            .split(",")
            .join(`,${ordinal}`)}`;
        } else {
          rruleString += `;BYMONTHDAY=${ordinal}`;
        }
      }
    }

    // Fine
    if (endCondition === "onDate" && endDate) {
      const untilDate = DateTime.fromISO(endDate, { zone: "utc" });
      const untilStr = untilDate.toFormat("yyyyMMdd'T'HHmmss'Z'");
      rruleString += `;UNTIL=${untilStr}`;
    } else if (endCondition === "afterOccurrences" && endOccurrences) {
      rruleString += `;COUNT=${endOccurrences}`;
    }

    return rruleString;
  };

  // Funzione per calcolare la durata di un evento
  const calculateDuration = (allDay, startDateTime, endDateTime) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (allDay) {
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
    }

    const diffMilliseconds = end - start;

    const totalMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const formattedHours = String(totalHours).padStart(2, "0");
    const formattedMinutes = String(remainingMinutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  // Funzione per riempire il recurrence form in base alla stringa RRule
  const parseRRule = (rruleString, custom, startDateTime) => {
    const rruleLine = rruleString
      .split("\n")
      .find((line) => line.startsWith("RRULE:"));
    const rrulePart = rruleLine ? rruleLine.split(":")[1] : rruleString;

    const rrule = rrulePart.split(";").reduce((acc, rule) => {
      const [key, value] = rule.split("=");
      acc[key.toLowerCase()] = value;
      return acc;
    }, {});

    const formatDate = (dateString) => {
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);
      return `${year}-${month}-${day}`;
    };

    const dayMap = {
      SU: "sunday",
      MO: "monday",
      TU: "tuesday",
      WE: "wednesday",
      TH: "thursday",
      FR: "friday",
      SA: "saturday",
      "SA,SU": "weekend",
      "MO,TU,WE,TH,FR": "weekday",
    };

    const formatDay = (day) => {
      return dayMap[day];
    };

    const formatDaysOfWeek = (bydayString) => {
      if (bydayString) {
        if (/^(?:[A-Z]{2})(?:,[A-Z]{2})*$/.test(bydayString)) {
          return bydayString.split(",");
        }
      }
      return [
        new Date(startDateTime)
          .toLocaleString("en-US", { weekday: "long" })
          .slice(0, 2)
          .toUpperCase(),
      ];
    };

    const formatMonthlyType = (bydayString, bymonthdayString) => {
      if (bymonthdayString) {
        if (/^\d+(,\d+)*$/.test(bymonthdayString)) {
          return "daysOfMonth";
        }
      } else if (bydayString) {
        return "weekdayOccurrences";
      }
      return "daysOfMonth";
    };

    const formatMonthDays = (bymonthdayString) => {
      if (bymonthdayString) {
        return bymonthdayString.split(",").map(Number);
      }
      return [new Date(startDateTime).getDate()];
    };

    const formatOrdinal = (bydayString, bymonthdayString) => {
      if (bydayString) {
        return bydayString.match(/[+-]?\d+/)?.[0];
      } else if (bymonthdayString) {
        if (/[^0-9,]/.test(bymonthdayString)) {
          return bymonthdayString.match(/[+-]?\d+/)[0];
        }
      }
      return "+1";
    };

    const formatDayOfWeek = (bydayString, bymonthdayString) => {
      if (bydayString) {
        return formatDay(
          bydayString
            .match(/(?:\+\d+)?([A-Z]{2})/g)
            ?.map((m) => m.slice(-2))
            .join(",")
        );
      }
      if (bymonthdayString) {
        if (/[^0-9,]/.test(bymonthdayString)) {
          return "day";
        }
      }
      return "sunday";
    };

    const formatYearMonths = (bymonthString) => {
      if (bymonthString) {
        return bymonthString.split(",").map(Number);
      }
      return [new Date(startDateTime).getMonth() + 1];
    };

    const recurrence = {
      type: custom ? "CUSTOM" : rrule.freq,
      frequency: custom ? rrule.freq : "DAILY",
      interval: rrule.interval || 1,
      daysOfWeek: formatDaysOfWeek(rrule.byday),
      monthlyType: formatMonthlyType(rrule.byday, rrule.bymonthday),
      monthDays: formatMonthDays(rrule.bymonthday),
      ordinal: formatOrdinal(rrule.byday, rrule.bymonthday),
      dayOfWeek: formatDayOfWeek(rrule.byday, rrule.bymonthday),
      yearMonths: formatYearMonths(rrule.bymonth),
      triggerDaysOfWeek:
        rrule.freq === "YEARLY" && rrule.bymonth && rrule.byday ? true : false,
      endCondition: rrule.until
        ? "onDate"
        : rrule.count
        ? "afterOccurrences"
        : "never",
      endDate: rrule.until
        ? formatDate(rrule.until)
        : calculateEndDateRecurrence(startDateTime, rrule.freq),
      endOccurrences: rrule.count || 2,
    };

    return recurrence;
  };

  const calculateEndDateRecurrence = (startDateTime, frequency) => {
    let baseDate = new Date(startDateTime);

    switch (frequency.toLowerCase()) {
      case "daily":
        baseDate.setDate(baseDate.getDate() + 7);
        break;
      case "weekly":
        baseDate.setMonth(baseDate.getMonth() + 1);
        break;
      case "monthly":
        baseDate.setFullYear(baseDate.getFullYear() + 1);
        break;
      case "yearly":
        baseDate.setFullYear(baseDate.getFullYear() + 3);
        break;
      default:
        return baseDate.toISOString().split("T")[0];
    }

    return baseDate.toISOString().split("T")[0];
  };

  // Funzione per mostrare la rrule in formato human readable
  const getRecurrenceSummary = (rruleString) => {
    try {
      const rule = rrulestr(rruleString);
      const options = rule.origOptions;
      let summary = "";
  
      const fullDayNames = {
        MO: "lunedì",
        TU: "martedì",
        WE: "mercoledì",
        TH: "giovedì",
        FR: "venerdì",
        SA: "sabato",
        SU: "domenica",
      };
  
      const fullMonthNames = [
        "gennaio",
        "febbraio",
        "marzo",
        "aprile",
        "maggio",
        "giugno",
        "luglio",
        "agosto",
        "settembre",
        "ottobre",
        "novembre",
        "dicembre",
      ];
  
      if (options.interval && options.interval > 1) {
        switch (options.freq) {
          case RRule.DAILY:
            summary += `Ogni ${options.interval} giorni`;
            break;
          case RRule.WEEKLY:
            summary += `Ogni ${options.interval} settimane`;
            break;
          case RRule.MONTHLY:
            summary += `Ogni ${options.interval} mesi`;
            break;
          case RRule.YEARLY:
            summary += `Ogni ${options.interval} anni`;
            break;
        }
      } else {
        switch (options.freq) {
          case RRule.DAILY:
            summary += `Ogni giorno`;
            break;
          case RRule.WEEKLY:
            summary += `Ogni settimana`;
            break;
          case RRule.MONTHLY:
            summary += `Ogni mese`;
            break;
          case RRule.YEARLY:
            summary += `Ogni anno`;
            break;
        }
      }
  
      if (options.byweekday) {
        const weekdayOrder = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
        const ordinals = [
          "primo",
          "secondo",
          "terzo",
          "quarto",
          "quinto",
          "ultimo",
        ];
  
        let ordinal;
  
        const days = options.byweekday
          .sort(
            (a, b) =>
              weekdayOrder.indexOf(a.weekday) - weekdayOrder.indexOf(b.weekday)
          )
          .map((day) => {
            const dayName = fullDayNames[day.toString().slice(-2)];
            ordinal = day.n ? ordinals[day.n > 0 ? day.n - 1 : 5] : "";
            if (dayName === "domenica") {
              ordinal = "prima";
            }
            return ordinal ? `${ordinal} ${dayName}` : dayName;
          });
  
        const isWeekdayPattern =
          days.length === 5 &&
          ["MO", "TU", "WE", "TH", "FR"].every((d) =>
            days.some((day) => day.includes(fullDayNames[d]))
          );
        const isWeekendPattern =
          days.length === 2 &&
          ["SA", "SU"].every((d) =>
            days.some((day) => day.includes(fullDayNames[d]))
          );
  
        if (isWeekdayPattern) {
          summary += ` nei giorni lavorativi`;
        } else if (isWeekendPattern) {
          summary += ` il weekend`;
        } else {
          summary += ` - ${days.join(", ")}`;
        }
      }
  
      if (options.bymonthday) {
        const monthDays = Array.isArray(options.bymonthday)
          ? options.bymonthday
          : [options.bymonthday];
        summary += ` il ${monthDays.join(", ")}`;
      }
  
      if (options.freq === RRule.YEARLY && options.bymonth) {
        const months = options.bymonth
          .map((month) => fullMonthNames[month - 1])
          .join(", ");
        summary += ` nei mesi di ${months}`;
      }
  
      if (options.until) {
        const endDate = DateTime.fromJSDate(options.until).toLocaleString(
          DateTime.DATE_FULL
        );
        summary += ` - ripeti fino al ${endDate}`;
      } else if (options.count) {
        summary += ` - ripeti ${options.count} volte`;
      }
  
      return summary || "Ricorrenza personalizzata";
    } catch (error) {
      console.error("Stringa RRule non valida", error);
      return "Ricorrenza personalizzata";
    }
  };

  return {
    handleRecurrence,
    calculateDuration,
    parseRRule,
    calculateEndDateRecurrence,
    getRecurrenceSummary
  };
};

export default RecurrenceHandler;
