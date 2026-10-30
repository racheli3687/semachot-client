import { motion } from "motion/react";
import type { Celebration } from "../../types";
import { WEEKDAY_LETTERS } from "../../utils/hebrewCalendar";
import { addDays } from "../../utils/dates";
import CalendarDay from "./CalendarDay";

type CalendarGridProps = {
    daysInMonth: number;
    firstWeekday: number;          // 0 = ראשון ... 6 = שבת
    firstDate: string;             // התאריך הלועזי של א׳ בחודש, "YYYY-MM-DD"
    celebrationsByDay: Map<number, Celebration[]>;
    todayDay: number | null;
    selectedDay: number | null;
    onSelectDay: (day: number) => void;
};

export default function CalendarGrid({
    daysInMonth, firstWeekday, firstDate, celebrationsByDay,
    todayDay, selectedDay, onSelectDay,
}: CalendarGridProps) {
    // משבצות ריקות עד היום בשבוע שבו החודש מתחיל, ואחריהן הימים 1..daysInMonth
    const cells: (number | null)[] = [
        ...Array.from({ length: firstWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1.5">
            {WEEKDAY_LETTERS.map((name) => (
                <div key={name} className={`pb-2 text-center text-xs font-semibold sm:text-sm ${name === "ש׳" ? "text-accent" : "text-muted"}`}>
                    {name}
                </div>
            ))}

            {cells.map((day, index) =>
                day === null ? (
                    <div key={`empty-${index}`} />
                ) : (
                    <motion.div
                        key={day}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.012, duration: 0.25 }}
                        className="flex"
                    >
                        <div className="flex-1 [&>button]:size-full">
                            <CalendarDay
                                day={day}
                                gregorianDay={Number(addDays(firstDate, day - 1).slice(8, 10))}
                                count={celebrationsByDay.get(day)?.length ?? 0}
                                isToday={day === todayDay}
                                isSelected={day === selectedDay}
                                onSelect={() => onSelectDay(day)}
                            />
                        </div>
                    </motion.div>
                )
            )}
        </div>
    );
}
