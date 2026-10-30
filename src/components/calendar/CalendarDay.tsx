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
            className={`group relative flex min-h-14 cursor-pointer flex-col items-center gap-1 rounded-2xl pt-1.5 pb-2 transition-colors duration-200 sm:min-h-24 sm:items-start sm:px-3 sm:pt-2.5 ${
                isSelected ? "bg-accent-soft" : "hover:bg-surface-2"
            }`}
        >
            <span className="flex w-full flex-col items-center sm:flex-row sm:items-baseline sm:gap-1.5">
                {/* היום: עיגול כחול מלא, כמו בלוח השנה של אייפון */}
                <strong
                    className={`grid size-8 place-items-center rounded-full text-[0.95rem] font-semibold sm:size-9 sm:text-lg ${
                        isToday ? "bg-accent text-white" : isSelected ? "text-accent" : ""
                    }`}
                >
                    {letter}
                </strong>
                <small className="text-[0.65rem] text-muted sm:text-xs">{gregorianDay}</small>
            </span>

            {count > 0 && (
                <span className="flex items-center gap-1 sm:mt-auto">
                    {/* נקודה לכל שמחה (עד 3), ובמחשב גם המספר */}
                    {Array.from({ length: Math.min(count, 3) }, (_, i) => (
                        <span key={i} className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                    ))}
                    <span className="hidden text-xs font-semibold text-accent sm:inline">{count}</span>
                </span>
            )}
        </button>
    );
}
