import { useQuery } from "@tanstack/react-query";
import { convertDate, getHebrewMonths, getHebrewToday } from "../api/hebrewCalendarApi";
import type { HebrewMonth } from "../types";


export function useHebrewTodayQuery() {
    return useQuery(
        {
            queryKey: ["hebrewToday"],
            queryFn: getHebrewToday,
            staleTime: 1000 * 60 * 60
        }
    );
}

export function useHebrewMonthsQuery(year: number | undefined) {
 
    return useQuery(
        {
            queryKey: ["hebrewMonths", year],
            queryFn: () => getHebrewMonths(year!),
            enabled: year !== undefined, 
            staleTime: Infinity
        }
    );
}
// המרת תאריך עברי ללועזי - לתצוגה מקדימה בטופס
export function useConvertDateQuery(
  day: number | undefined,
  month: HebrewMonth | undefined,
  year: number | undefined
) {
  return useQuery({
    queryKey: ["convertDate", year, month, day],
    queryFn: () => convertDate({ day, month, year }),
    enabled: day !== undefined && month !== undefined && year !== undefined,
    staleTime: Infinity,
    retry: false,
  });
}