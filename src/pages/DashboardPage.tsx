import { Link, useSearchParams } from "react-router-dom";
import { celebrationParamsFromSearch, type DashboardView } from "../utils/celebrationFilters";
import { useHebrewTodayQuery } from "../hooks/useHebrewCalendar";
import type { HebrewMonth } from "../types";
import CelebrationListView from "../components/celebrations/CelebrationListView";
import CelebrationCalendarView from "../components/calendar/CelebrationCalendarView";
import TodayCelebrations from "../components/celebrations/TodayCelebrations";
import CelebrationFilters from "../components/celebrations/CelebrationFilters";
import ViewToggle from "../components/celebrations/ViewToggle";
import Loading from "../components/Loading";

export default function DashboardPage() {
   const [searchParams, setSearchParams] = useSearchParams();
   const params = celebrationParamsFromSearch(searchParams);

   // סוג התצוגה: רשימה (ברירת מחדל) או לוח
   const view: DashboardView = searchParams.get("view") === "calendar" ? "calendar" : "list";

   // החודש שהלוח מציג: מהכתובת, ואם אין - החודש העברי הנוכחי
   const { data: today } = useHebrewTodayQuery();
   const calendarYear = params.hebrewYear ?? today?.hebrewDate.year;
   const calendarMonth = params.hebrewMonth ?? today?.hebrewDate.month;

   function changePage(page: number) {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(page));
      setSearchParams(next);
      window.scrollTo({ top: 0 });
   }

   function updateFilter(key: string, value: string | undefined) {
      const next = new URLSearchParams(searchParams);

      if (value === undefined || value === "") {
         next.delete(key);
      } else {
         next.set(key, value);
      }

      next.delete("page");
      setSearchParams(next);
   }

   function updateHebrewYear(year: string | undefined) {
      const next = new URLSearchParams(searchParams);

      if (!year) {
         next.delete("hebrewYear");
      } else {
         next.set("hebrewYear", year);
      }

      next.delete("hebrewMonth");
      next.delete("page");
      setSearchParams(next);
   }

   function changeView(nextView: DashboardView) {
      const next = new URLSearchParams(searchParams);

      if (nextView === "calendar") {
         next.set("view", "calendar");
      }else {
         next.delete("view");
         // החודש נכתב בכתובת בגלל הדפדוף בלוח, ולא בגלל שנבחר כסינון
         next.delete("hebrewYear");
         next.delete("hebrewMonth");
      }

      next.delete("page");
      setSearchParams(next);
   }

   function changeCalendarMonth(year: number, month: HebrewMonth) {
      const next = new URLSearchParams(searchParams);
      next.set("hebrewYear", String(year));
      next.set("hebrewMonth", month);
      next.delete("page");
      setSearchParams(next);
   }

   function clearFilters() {
      // הניקוי לא מחזיר מהלוח לרשימה
      setSearchParams(view === "calendar" ? { view: "calendar" } : {});
   }

   return (
      <>
         <h1>הלוח שלי</h1>

         <TodayCelebrations />

         <Link to="/celebrations/new">+ הוספת שמחה</Link>

         <ViewToggle value={view} onChange={changeView} />

         <CelebrationFilters
            view={view}
            values={searchParams}
            onChange={updateFilter}
            onHebrewYearChange={updateHebrewYear}
            onClear={clearFilters}
         />

         {view === "list" ? (
            <CelebrationListView params={params} onPageChange={changePage} />
         ) : calendarYear && calendarMonth ? (
            <CelebrationCalendarView
               key={`${calendarYear}-${calendarMonth}`}
               filters={params}
               year={calendarYear}
               month={calendarMonth}
               onMonthChange={changeCalendarMonth}
            />
         ) : (
            <Loading message="טוען את הלוח..." />
         )}
      </>
   );
}