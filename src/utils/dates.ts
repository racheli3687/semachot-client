// "2026-10-26" -> "26/10/2026"
export function formatGregorianDate(date: string): string {
  return date.split("-").reverse().join("/");
}