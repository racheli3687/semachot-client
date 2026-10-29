import { Link, useSearchParams } from "react-router-dom";
import { celebrationParamsFromSearch } from "../utils/celebrationFilters";
import CelebrationListView from "../components/celebrations/CelebrationListView";
import TodayCelebration from "../components/celebrations/TodayCelebrations";
import CelebrationFilters from "../components/celebrations/CelebrationFilters";

export default function DashboardPage() {
   const [searchParams, setSearchParams] = useSearchParams();
   const params = celebrationParamsFromSearch(searchParams);

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
      if (!year)
         next.delete("hebrewYear");
      else {
         next.set("hebrewYear", year);
      }
      next.delete("hebrewMonth");
      next.delete("page");
      setSearchParams(next)
   }

   function clearFilters() {
      setSearchParams({});
   }


   return (
      <>
         <h1>הלוח שלי</h1>
         <TodayCelebration />
         <Link to="/celebrations/new">+ הוספת שמחה</Link>
         <CelebrationFilters
            values={searchParams}
            onChange={updateFilter}
            onHebrewYearChange={updateHebrewYear}
            onClear={clearFilters}
         />
         <CelebrationListView params={params} onPageChange={changePage} />
      </>
   );
}