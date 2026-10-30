import { useState } from "react";
import type { Celebration, GetCelebrationsParams, HebrewMonth } from "../../types";
import { useCelebrationsQuery } from "../../hooks/useCelebrations";
import {
    useConvertDateQuery,
    useHebrewMonthsQuery,
    useHebrewTodayQuery,
} from "../../hooks/useHebrewCalendar";
import { HEBREW_DAY_LETTERS, findMonthInYear } from "../../utils/hebrewCalendar";
import { weekdayOf } from "../../utils/dates";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import DayCelebrations from "./DayCelebrations";

type CelebrationCalendarViewProps = {
    filters: GetCelebrationsParams;
    year: number;
    month: HebrewMonth;
    onMonthChange: (year: number, month: HebrewMonth) => void;
};

export default function CelebrationCalendarView({
    filters, year, month, onMonthChange,
}: CelebrationCalendarViewProps) {
    // 1. החודשים של השנה - כמה ימים בכל חודש, ובאיזה סדר
    const monthsQuery = useHebrewMonthsQuery(year);
    const months = monthsQuery.data?.months ?? [];
    // החודש להצגה. אם החודש מהכתובת לא קיים בשנה - האדר המתאים (ראי findMonthInYear)
    const monthInfo = findMonthInYear(months, month);

    // 2. באיזה תאריך לועזי (ולכן באיזה יום בשבוע) מתחיל החודש
    const firstDayQuery = useConvertDateQuery(
        monthInfo ? 1 : undefined,
        monthInfo?.month,
        monthInfo ? year : undefined
    );

    // 3. כל השמחות של החודש, עם הסינונים מהכתובת
    const celebrationsQuery = useCelebrationsQuery(
        {
            groupId: filters.groupId,
            type: filters.type,
            mine: filters.mine,
            search: filters.search,
            hebrewYear: year,
            hebrewMonth: monthInfo?.month,
            when: "all",
            sort: "date_asc",
            pageSize: 50,
        },
        { enabled: monthInfo !== undefined }
    );

    // 4. היום - לסימון במסגרת, ולבחירה התחלתית
    const { data: today } = useHebrewTodayQuery();
    const isThisMonth =
        today?.hebrewDate.year === year && today?.hebrewDate.month === monthInfo?.month;

    // היום שהמשתמשת בחרה בלחיצה. null = עוד לא בחרה
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    // היום שמוצג כבחור: מה שנבחר בלחיצה, ואם לא נבחר כלום - היום (אם זה החודש הנוכחי).
    // מחושב בכל רינדור, ולכן מתעדכן גם כש"היום" מגיע מהשרת אחרי שהלוח כבר הוצג.
    const shownDay = selectedDay ?? (isThisMonth && today ? today.hebrewDate.day : null);

    if (monthsQuery.isError) return <ErrorMessage error={monthsQuery.error} />;
    if (firstDayQuery.isError) return <ErrorMessage error={firstDayQuery.error} />;
    if (!monthInfo || !firstDayQuery.data) return <Loading message="טוען את הלוח..." />;

    // קיבוץ השמחות לפי היום בחודש.
    // בזמן מעבר חודש מוצגים הנתונים של החודש הקודם (placeholder) - לא משבצים אותם.
    const celebrationsByDay = new Map<number, Celebration[]>();
    const data = celebrationsQuery.data;
    if (data && !celebrationsQuery.isPlaceholderData) {
        for (const celebration of data.items) {
            const day = celebration.hebrewDate.day;
            const list = celebrationsByDay.get(day) ?? [];
            list.push(celebration);
            celebrationsByDay.set(day, list);
        }
    }

    // מעבר חודשים - כולל מעבר שנה (אלול <-> תשרי)
    const index = months.findIndex((m) => m.month === monthInfo.month);

    function goPrev() {
        if (index > 0) onMonthChange(year, months[index - 1].month);
        else onMonthChange(year - 1, "ELUL");
    }

    function goNext() {
        if (index < months.length - 1) onMonthChange(year, months[index + 1].month);
        else onMonthChange(year + 1, "TISHREI");
    }

    const title = `${monthInfo.name} ${monthsQuery.data?.yearText ?? ""}`;

    return (
        <section aria-label="לוח שמחות חודשי" className="panel">
            <CalendarHeader title={title} onPrev={goPrev} onNext={goNext} />

            <div className={`transition-opacity duration-300 ${celebrationsQuery.isPlaceholderData ? "opacity-50" : ""}`}>
                <CalendarGrid
                    daysInMonth={monthInfo.days}
                    firstWeekday={weekdayOf(firstDayQuery.data.date)}
                    firstDate={firstDayQuery.data.date}
                    celebrationsByDay={celebrationsByDay}
                    todayDay={isThisMonth && today ? today.hebrewDate.day : null}
                    selectedDay={shownDay}
                    onSelectDay={setSelectedDay}
                />
            </div>
            {(celebrationsQuery.isPending || celebrationsQuery.isPlaceholderData) && (
                <Loading message="טוען שמחות..." />
            )}
            {celebrationsQuery.isError && <ErrorMessage error={celebrationsQuery.error} />}

            {data && data.total > data.items.length && (
                <p className="hint mt-4 text-center">מוצגות {data.items.length} השמחות הראשונות מתוך {data.total}. אפשר לצמצם בעזרת הסינון.</p>
            )}

            {shownDay !== null && (
                <DayCelebrations
                    title={`${HEBREW_DAY_LETTERS[shownDay - 1]} ${monthInfo.name}`}
                    celebrations={celebrationsByDay.get(shownDay) ?? []}
                />
            )}
        </section>
    );
}