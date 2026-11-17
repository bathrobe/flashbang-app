import { settings } from "./settings";

// All dates in src/game are calendar-date strings like "2026-11-16".

// Add (or subtract) whole days. Uses UTC arithmetic so daylight saving never shifts the result.
export function addDaysToDate(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

// Whole days from one calendar date to another (negative if `to` is earlier).
export function getDaysBetween(from: string, to: string): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(to) - Date.parse(from)) / millisecondsPerDay);
}

// The learner's date: the calendar date in their time zone, with the day starting at 04:00.
export function getLearnerDate(instant: Date, timeZone: string): string {
  const parts = getFormatter(timeZone).formatToParts(instant);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? "";

  const calendarDate = `${read("year")}-${read("month")}-${read("day")}`;
  const isBeforeDayStart = Number(read("hour")) < settings.learnerDay.startHour;
  return isBeforeDayStart ? addDaysToDate(calendarDate, -1) : calendarDate;
}

function getFormatter(timeZone: string) {
  const options = {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23",
  } as const;
  try {
    return new Intl.DateTimeFormat("en-CA", { ...options, timeZone });
  } catch {
    // An unknown or missing time-zone name: fall back to UTC instead of crashing the page.
    return new Intl.DateTimeFormat("en-CA", { ...options, timeZone: "UTC" });
  }
}
