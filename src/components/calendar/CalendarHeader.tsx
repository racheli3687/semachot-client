import { motion } from "motion/react";
import Icon from "../ui/Icon";

type CalendarHeaderProps = {
    title: string;
    onPrev: () => void;
    onNext: () => void;
};

export default function CalendarHeader({ title, onPrev, onNext }: CalendarHeaderProps) {
    return (
        <div className="mb-5 flex items-center justify-between gap-2">
            <motion.h2
                key={title}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                aria-live="polite"
                className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl"
            >
                {title}
            </motion.h2>
            <div className="flex gap-1">
                <button type="button" onClick={onPrev} className="btn btn-ghost btn-icon" aria-label="החודש הקודם" title="החודש הקודם">
                    <Icon name="chevronRight" />
                </button>
                <button type="button" onClick={onNext} className="btn btn-ghost btn-icon" aria-label="החודש הבא" title="החודש הבא">
                    <Icon name="chevronLeft" />
                </button>
            </div>
        </div>
    );
}
