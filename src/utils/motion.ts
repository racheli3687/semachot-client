import type { Transition, Variants } from "motion/react";

// הגדרות אנימציה משותפות לכל האתר - כדי שהתנועה תהיה אחידה

export const spring: Transition = { type: "spring", stiffness: 260, damping: 26 };

// הופעה מלמטה למעלה
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: spring },
};

// הורה שמפעיל את הילדים בזה אחר זה
export const stagger = (step = 0.06, delay = 0): Variants => ({
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: delay } },
});
