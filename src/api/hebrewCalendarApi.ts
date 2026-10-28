
import { apiRequest } from "./api";
import type {
  HebrewTodayResponse,
  HebrewMonthsResponse,
  ConvertDateResponse,
  ConvertDateParams,
} from "../types";

// קבלת התאריך העברי והלועזי של היום
export function getHebrewToday(): Promise<HebrewTodayResponse> {
  return apiRequest<HebrewTodayResponse>(
    "/api/hebrew-calendar/today"
  );
}

// קבלת חודשי שנה עברית ומספר הימים בכל חודש
export function getHebrewMonths(
  year: number
): Promise<HebrewMonthsResponse> {
  const params = new URLSearchParams({
    year: String(year),
  });

  return apiRequest<HebrewMonthsResponse>(
    `/api/hebrew-calendar/months?${params.toString()}`
  );
}

// המרת תאריך בין הלוח הלועזי לעברי
export function convertDate(
  details: ConvertDateParams
): Promise<ConvertDateResponse> {
  const params = new URLSearchParams();

  if (details.date !== undefined) {
    params.set("date", details.date);
  }

  if (details.day !== undefined) {
    params.set("day", String(details.day));
  }

  if (details.month !== undefined) {
    params.set("month", details.month);
  }

  if (details.year !== undefined) {
    params.set("year", String(details.year));
  }

  return apiRequest<ConvertDateResponse>(
    `/api/hebrew-calendar/convert?${params.toString()}`
  );
}
