type CalendarHeaderProps = {
    title: string;
    onPrev: () => void;
    onNext: () => void;
};

export default function CalendarHeader({ title, onPrev, onNext }: CalendarHeaderProps) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button type="button" onClick={onPrev}>→ החודש הקודם</button>
            <h2 aria-live="polite">{title}</h2>
            <button type="button" onClick={onNext}>החודש הבא ←</button>
        </div>
    );
}