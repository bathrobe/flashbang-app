const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// "2026-11-17" -> "Tuesday 17 November". Written by hand, not with Intl, so the
// server and the browser always produce exactly the same text.
export function formatCalendarDate(calendarDate: string): string {
  const [year, month, day] = calendarDate.split("-").map(Number);
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return `${dayNames[dayOfWeek]} ${day} ${monthNames[month - 1]}`;
}
