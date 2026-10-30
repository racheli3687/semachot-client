import { motion } from "motion/react";

type LogoProps = {
    size?: "md" | "lg";
    withText?: boolean;
};

// הלוגו: אייקון של לוח שנה עם כוכב, על רקע צבעוני - כמו אייקון של אפליקציה
export default function Logo({ size = "md", withText = true }: LogoProps) {
    const box = size === "lg" ? "size-12 rounded-[0.9rem]" : "size-9 rounded-[0.7rem]";
    const text = size === "lg" ? "text-2xl" : "text-[1.15rem]";

    return (
        <span className="flex items-center gap-2.5">
            <motion.span
                className={`grid ${box} shrink-0 place-items-center bg-gradient-to-br from-[#ff9f6b] via-[#ff6fa8] via-40% to-[#4fb6ff] shadow-[0_6px_16px_-6px_rgb(139_123_255/0.7)]`}
                whileHover={{ rotate: -8, scale: 1.06 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
                aria-hidden="true"
            >
                <svg viewBox="0 0 24 24" className="size-[62%]" fill="none">
                    <rect x="3.5" y="5" width="17" height="15.5" rx="4" stroke="#fff" strokeWidth="2" />
                    <path d="M8 3v4M16 3v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 10.2l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" fill="#fff" />
                </svg>
            </motion.span>
            {withText && <span className={`${text} font-extrabold tracking-[-0.01em] text-ink`}>לוח שמחות</span>}
        </span>
    );
}
