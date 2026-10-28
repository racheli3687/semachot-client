import { useQuery } from "@tanstack/react-query";
import { getHebrewMonths, getHebrewToday } from "../api/hebrewCalendarApi";


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