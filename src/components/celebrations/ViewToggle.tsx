import { motion } from "motion/react";
import type { DashboardView } from "../../utils/celebrationFilters";
import Icon, { type IconName } from "../ui/Icon";

type ViewToggleProps = {
    value: DashboardView;
    onChange: (view: DashboardView) => void;
};

const VIEW_LABELS: Record<DashboardView, string> = {
    list: "רשימה",
    calendar: "לוח",
};

const VIEW_ICONS: Record<DashboardView, IconName> = {
    list: "list",
    calendar: "calendar",
};

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
    return (
        <div role="group" aria-label="סוג תצוגה" className="segmented">
            {(Object.keys(VIEW_LABELS) as DashboardView[]).map((view) => (
                <button
                    key={view}
                    type="button"
                    aria-pressed={value === view}
                    onClick={() => onChange(view)}
                    className="relative !bg-transparent !shadow-none"
                >
                    {value === view && (
                        <motion.span
                            layoutId="view-toggle-pill"
                            className="absolute inset-0 rounded-full bg-surface shadow-[0_1px_4px_rgb(0_0_0/0.14)] dark:bg-[#636366]"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                    )}
                    <span className="relative flex items-center gap-1.5">
                        <Icon name={VIEW_ICONS[view]} className="size-4" />
                        {VIEW_LABELS[view]}
                    </span>
                </button>
            ))}
        </div>
    );
}
