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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {WEEKDAY_LETTERS.map((name) => (
                <div key={name} style={{ textAlign: "center", fontWeight: "bold" }}>
                    {name}
                </div>
            ))}

            {cells.map((day, index) =>
                day === null ? (
                    <div key={`empty-${index}`} />
                ) : (
                    <CalendarDay
                        key={day}
                        day={day}
                        gregorianDay={Number(addDays(firstDate, day - 1).slice(8, 10))}
                        count={celebrationsByDay.get(day)?.length ?? 0}
                        isToday={day === todayDay}
                        isSelected={day === selectedDay}
                        onSelect={() => onSelectDay(day)}
                    />
                )
            )}
        </div>
    );
}