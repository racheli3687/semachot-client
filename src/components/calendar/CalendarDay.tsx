import { HEBREW_DAY_LETTERS } from "../../utils/hebrewCalendar";

type CalendarDayProps = {
    day: number;
    gregorianDay: number;
    count: number;
    isToday: boolean;
    isSelected: boolean;
    onSelect: () => void;
};

export default function CalendarDay({
    day, gregorianDay, count, isToday, isSelected, onSelect,
}: CalendarDayProps) {
    const letter = HEBREW_DAY_LETTERS[day - 1];
    const countText =
        count === 0 ? "אין שמחות" : count === 1 ? "שמחה אחת" : `${count} שמחות`;
    const label = `${letter}, ${countText}`;

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={isSelected}
            aria-label={label}
            aria-current={isToday ? "date" : undefined}
            style={{
                minHeight: 64,
                padding: 4,
                textAlign: "start",
                border: isToday ? "2px solid currentColor" : "1px solid #ccc",
                background: isSelected ? "#dde6ff" : count > 0 ? "#fff3d6" : "transparent",
                cursor: "pointer",
            }}
        >
            <strong>{letter}</strong>{" "}
            <small>{gregorianDay}</small>
            {count > 0 && <div>🎉 {count}</div>}
        </button>
    );
}