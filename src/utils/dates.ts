// "2026-10-26" -> "26/10/2026"
export function formatGregorianDate(date: string): string {
  return date.split("-").reverse().join("/");
}
// מוסיף ימים לתאריך: addDays("2026-10-26", 6) -> "2026-11-01"
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// היום בשבוע: 0 = ראשון ... 6 = שבת
export function weekdayOf(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}