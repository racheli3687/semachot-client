import { motion } from "motion/react";
import type { Celebration } from "../../types";
import CelebrationCard from "../celebrations/CelebrationCard";
import { fadeUp, stagger } from "../../utils/motion";
import Icon from "../ui/Icon";

type DayCelebrationsProps = {
    title: string;                 // למשל "ט״ו חשוון"
    celebrations: Celebration[];
};

export default function DayCelebrations({ title, celebrations }: DayCelebrationsProps) {
    return (
        <motion.section
            key={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            aria-live="polite"
            className="mt-8"
        >
            <h3 className="mb-4 flex items-center gap-3 text-xl font-bold tracking-[-0.01em]">
                <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent"><Icon name="calendar" className="size-[1.1rem]" /></span>
                שמחות ב־{title}
            </h3>

            {celebrations.length === 0 ? (
                <p className="rounded-[1.5rem] bg-surface-2 px-6 py-8 text-center text-muted">אין שמחות ביום הזה. אולי זה יום טוב להוסיף אחת?</p>
            ) : (
                <motion.ul
                    initial="hidden"
                    animate="show"
                    variants={stagger(0.06)}
                    className="list"
                >
                    {celebrations.map((celebration) => (
                        <motion.li key={celebration.id} variants={fadeUp}>
                            <CelebrationCard celebration={celebration} />
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </motion.section>
    );
}
