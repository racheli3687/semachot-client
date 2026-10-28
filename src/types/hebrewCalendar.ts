
import type { HebrewDate, HebrewMonth } from "./celebration";

export interface HebrewTodayResponse {
  date: string;
  hebrewDate: HebrewDate;
  yearText: string;
}

export interface HebrewMonthInfo {
  month: HebrewMonth;
  name: string;
  days: number;
}

export interface HebrewMonthsResponse {
  year: number;
  yearText: string;
  isLeapYear: boolean;
  months: HebrewMonthInfo[];
}

export interface ConvertDateResponse {
  date: string;
  hebrewDate: HebrewDate;
}

export interface ConvertDateParams {
  date?: string;
  day?: number;
  month?: HebrewMonth;
  year?: number;
}
