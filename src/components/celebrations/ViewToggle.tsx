import type { DashboardView } from "../../utils/celebrationFilters";

type ViewToggleProps = {
    value: DashboardView;
    onChange: (view: DashboardView) => void;
};

const VIEW_LABELS: Record<DashboardView, string> = {
    list: "רשימה",
    calendar: "לוח",
};

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
    return (
        <div role="group" aria-label="סוג תצוגה">
            {(Object.keys(VIEW_LABELS) as DashboardView[]).map((view) => (
                <button
                    key={view}
                    type="button"
                    aria-pressed={value === view}
                    onClick={() => onChange(view)}
                >
                    {VIEW_LABELS[view]}
                </button>
            ))}
        </div>
    );
}