import type { HebrewMonth, HebrewMonthInfo } from "../types";

// הימים בחודש עברי: אינדקס 0 = א׳, אינדקס 29 = ל׳
export const HEBREW_DAY_LETTERS = [
  "א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳",
  "י״א", "י״ב", "י״ג", "י״ד", "ט״ו", "ט״ז", "י״ז", "י״ח", "י״ט", "כ׳",
  "כ״א", "כ״ב", "כ״ג", "כ״ד", "כ״ה", "כ״ו", "כ״ז", "כ״ח", "כ״ט", "ל׳",
] as const;

// ימות השבוע: אינדקס 0 = יום ראשון (כמו getDay ב-JavaScript)
export const WEEKDAY_LETTERS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"] as const;


// מוצא את החודש המבוקש ברשימת החודשים של השנה.
// אם הוא לא קיים בשנה הזאת - מחזיר את האדר המתאים:
//   ADAR בשנה מעוברת          -> ADAR_II (אדר ב׳)
//   ADAR_I / ADAR_II בשנה רגילה -> ADAR
// ואם גם זה לא נמצא - החודש הראשון ברשימה.
export function findMonthInYear(
  months: HebrewMonthInfo[],
  month: HebrewMonth
): HebrewMonthInfo | undefined {
  const exact = months.find((m) => m.month === month);
  if (exact) return exact;

  let replacement: HebrewMonth | undefined;
  if (month === "ADAR") replacement = "ADAR_II";
  if (month === "ADAR_I" || month === "ADAR_II") replacement = "ADAR";

  return months.find((m) => m.month === replacement) ?? months[0];
}