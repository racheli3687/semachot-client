import { useSearchParams } from "react-router-dom";
import { celebrationParamsFromSearch, type DashboardView } from "../utils/celebrationFilters";
import { useHebrewTodayQuery } from "../hooks/useHebrewCalendar";
import type { HebrewMonth } from "../types";
import CelebrationListView from "../components/celebrations/CelebrationListView";
import CelebrationCalendarView from "../components/calendar/CelebrationCalendarView";
import TodayCelebrations from "../components/celebrations/TodayCelebrations";
import CelebrationFilters from "../components/celebrations/CelebrationFilters";
import ViewToggle from "../components/celebrations/ViewToggle";
import Loading from "../components/Loading";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../utils/motion";
import DashboardWidgets from "../components/dashboard/DashboardWidgets";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
   const [searchParams, setSearchParams] = useSearchParams();
   const params = celebrationParamsFromSearch(searchParams);

   // סוג התצוגה: רשימה (ברירת מחדל) או לוח
   const view: DashboardView = searchParams.get("view") === "calendar" ? "calendar" : "list";

   // החודש שהלוח מציג: מהכתובת, ואם אין - החודש העברי הנוכחי
   const { data: today } = useHebrewTodayQuery();

   // לפתיחה בלבד (תצוגה): השם
   const { user } = useAuth();
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
         {/* פתיחה */}
         <motion.header initial="hidden" animate="show" variants={stagger(0.1)} className="mb-10 sm:mb-14">
            <motion.p variants={fadeUp} className="eyebrow">
               {user ? `שלום, ${user.fullName.split(" ")[0]}` : "\u00a0"}
            </motion.p>
            <motion.h1 variants={fadeUp} className="page-title mt-2">
               כל השמחות.
               <br />
               במקום אחד.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-xl leading-relaxed text-muted sm:text-2xl">
               החתונות, הבריתות והקידושים של המשפחה והחברות, בלוח עברי אחד משותף.
            </motion.p>
         </motion.header>

         {/* ווידג'טים */}
         <motion.section
            initial="hidden"
            animate="show"
            variants={stagger(0.08, 0.2)}
            aria-label="סיכום"
            className="mb-16 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-[1.35fr_1fr_1fr]"
         >
            <motion.div variants={fadeUp} className="col-span-2 lg:col-span-1 lg:row-span-2">
               <TodayCelebrations />
            </motion.div>
            <DashboardWidgets />
         </motion.section>

         <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="section-title">{view === "list" ? "השמחות שלך" : "לוח חודשי"}</h2>
            <ViewToggle value={view} onChange={changeView} />
         </div>

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