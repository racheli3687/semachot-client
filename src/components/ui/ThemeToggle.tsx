import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "../../hooks/useTheme";
import Icon from "./Icon";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="grid size-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full bg-surface text-ink ring-1 ring-line transition hover:bg-surface-2"
            aria-label={isDark ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
            title={isDark ? "מצב בהיר" : "מצב כהה"}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ y: 16, rotate: -90, opacity: 0 }}
                    animate={{ y: 0, rotate: 0, opacity: 1 }}
                    exit={{ y: -16, rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <Icon name={isDark ? "sun" : "moon"} className="size-[1.15rem]" />
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
