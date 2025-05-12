import { DateTime } from "luxon";
import pkg from "rrule";
const { RRule, rrulestr } = pkg;

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

export default getRecurrenceSummary;