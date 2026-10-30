import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useCelebrationsQuery, useTodayCelebrationsQuery } from "../../hooks/useCelebrations";
import { useConvertDateQuery, useHebrewMonthsQuery, useHebrewTodayQuery } from "../../hooks/useHebrewCalendar";
import { HEBREW_DAY_LETTERS, WEEKDAY_LETTERS } from "../../utils/hebrewCalendar";
import { weekdayOf } from "../../utils/dates";
import { countdownText, daysBetween } from "../../utils/countdown";
import { MONTH_NAMES } from "../../utils/celebrationVisuals";
import { fadeUp } from "../../utils/motion";
import Icon from "../ui/Icon";

const tile = "card flex min-h-48 flex-col gap-1 p-6";

// ארבע "ווידג'טים" בלוח הראשי: היום, שמחות היום, השמחה הבאה, ולוח החודש
export default function DashboardWidgets() {
    const { data: today } = useHebrewTodayQuery();
    const { data: todayCelebrations } = useTodayCelebrationsQuery();

    // השמחה הבאה: הקרובה ביותר שהיא לא היום
    const { data: upcoming } = useCelebrationsQuery({ when: "upcoming", sort: "date_asc", pageSize: 10 });
    const next = upcoming?.items.find((c) => !c.isToday);
    const daysToNext = today && next ? daysBetween(today.date, next.date) : null;

    // לוח החודש הנוכחי
    const year = today?.hebrewDate.year;
    const month = today?.hebrewDate.month;
    const { data: monthsData } = useHebrewMonthsQuery(year);
    const monthInfo = monthsData?.months.find((m) => m.month === month);
    const { data: firstDay } = useConvertDateQuery(monthInfo ? 1 : undefined, month, monthInfo ? year : undefined);
    const { data: monthCelebrations } = useCelebrationsQuery(
        { hebrewYear: year, hebrewMonth: month, when: "all", sort: "date_asc", pageSize: 50 },
        { enabled: !!year && !!month }
    );
    const markedDays = new Set(monthCelebrations?.items.map((c) => c.hebrewDate.day));

    const cells: (number | null)[] =
        monthInfo && firstDay
            ? [
                ...Array.from({ length: weekdayOf(firstDay.date) }, () => null),
                ...Array.from({ length: monthInfo.days }, (_, i) => i + 1),
            ]
            : [];

    return (
        <>
            {/* היום */}
            <motion.div variants={fadeUp} className={tile}>
                <span className="text-sm font-medium text-muted">היום</span>
                <span className="mt-auto text-5xl leading-none font-extrabold tracking-[-0.03em] sm:text-6xl">
                    {today ? HEBREW_DAY_LETTERS[today.hebrewDate.day - 1] : " "}
                </span>
                <span className="mt-2 text-[1.05rem] font-semibold">
                    {today ? `${MONTH_NAMES[today.hebrewDate.month]} ${today.yearText}` : " "}
                </span>
                <span className="text-sm text-muted">
                    {today
                        ? new Date(`${today.date}T12:00:00`).toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })
                        : " "}
                </span>
            </motion.div>

            {/* שמחות היום */}
            <motion.div variants={fadeUp} className={`${tile} mesh-cool text-white !ring-0`}>
                <span className="text-sm font-medium text-white/85">שמחות היום</span>
                <span className="mt-auto text-6xl leading-none font-extrabold">{todayCelebrations?.length ?? " "}</span>
                <span className="mt-2 truncate text-[1.05rem] font-semibold">
                    {todayCelebrations && todayCelebrations.length > 0
                        ? todayCelebrations.map((c) => c.typeLabel).join(" ו")
                        : "אין שמחות היום"}
                </span>
                <span className="text-sm text-white/80">
                    {todayCelebrations && todayCelebrations.length > 0 ? "זה הזמן לשלוח ברכה" : "יום רגוע"}
                </span>
            </motion.div>

            {/* השמחה הבאה - בעוד X ימים */}
            <motion.div variants={fadeUp} className={`${tile} relative col-span-2 lg:col-span-1`}>
                <span className="text-sm font-medium text-muted">השמחה הבאה</span>
                {next && daysToNext !== null ? (
                    <>
                        <span className="mt-auto text-4xl leading-none font-extrabold tracking-[-0.03em] sm:text-5xl">
                            {countdownText(daysToNext)}
                        </span>
                        <Link
                            to={`/celebrations/${next.id}`}
                            className="mt-2 truncate text-[1.05rem] font-semibold text-ink no-underline after:absolute after:inset-0 after:content-[''] hover:no-underline"
                        >
                            {next.title}
                        </Link>
                        <span className="truncate text-sm text-muted">{next.hebrewDate.text} · {next.venueName}</span>
                    </>
                ) : (
                    <span className="mt-auto text-[1.05rem] text-muted">{upcoming ? "אין עוד שמחות קרובות" : " "}</span>
                )}
            </motion.div>

            {/* לוח החודש - לחיצה פותחת את תצוגת הלוח */}
            <motion.div variants={fadeUp} className={`${tile} relative col-span-2 lg:col-span-1`}>
                <Link to="/?view=calendar" className="flex items-center justify-between text-sm font-medium text-muted no-underline after:absolute after:inset-0 after:content-[''] hover:no-underline">
                    {monthsData && month ? `${MONTH_NAMES[month]} ${monthsData.yearText}` : " "}
                    <Icon name="chevronLeft" className="size-4" />
                </Link>
                <div className="mt-2 grid grid-cols-7 gap-0.5 text-center text-[0.7rem] text-muted" aria-hidden="true">
                    {WEEKDAY_LETTERS.map((d) => (
                        <span key={d} className="pb-1 font-semibold">{d}</span>
                    ))}
                    {cells.map((day, i) => (
                        <span
                            key={i}
                            className={`mx-auto grid size-6 place-items-center rounded-full ${
                                day === null
                                    ? ""
                                    : day === today?.hebrewDate.day
                                        ? "bg-accent font-bold text-white"
                                        : markedDays.has(day)
                                            ? "bg-accent-soft font-bold text-accent"
                                            : ""
                            }`}
                        >
                            {day ?? ""}
                        </span>
                    ))}
                </div>
            </motion.div>
        </>
    );
}
