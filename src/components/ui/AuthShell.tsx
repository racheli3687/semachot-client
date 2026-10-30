import type { ReactNode } from "react";
import { motion } from "motion/react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { fadeUp, stagger } from "../../utils/motion";

type AuthShellProps = {
    title: string;
    subtitle: string;
    children: ReactNode;
};

// כרטיסי שמחות "שקופים" שמרחפים על הרקע הצבעוני (קישוט בלבד)
const FLOATING = [
    { dot: "bg-sys-orange", top: "היום · 19:30", title: "החתונה של משה ורבקה", sub: "אולמי הנסיכה", className: "top-[9%] right-[8%]", rotate: -3, delay: 0.5 },
    { dot: "bg-sys-blue", top: "כ״ה חשוון", title: "בר מצווה של יוסי", sub: "בעוד 6 ימים", className: "top-[25%] left-[7%]", rotate: 4, delay: 0.7 },
    { dot: "bg-sys-green", top: "תזכורת", title: "השמחות של היום מחכות לך", sub: "", className: "top-[42%] right-[16%]", rotate: -1.5, delay: 0.9 },
];

// מסגרת למסכי התחברות והרשמה: טופס נקי בצד אחד, ורקע צבעוני עם כרטיסים מרחפים בצד השני
export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
    return (
        <div className="grid min-h-dvh lg:grid-cols-2">
            {/* צד הטופס */}
            <section className="flex flex-col px-6 py-6 sm:px-12 lg:px-16">
                <div className="flex items-center justify-between">
                    <Logo />
                    <ThemeToggle />
                </div>

                <div className="flex flex-1 items-center py-10">
                    <motion.div
                        className="mx-auto w-full max-w-[26rem] lg:mx-0"
                        initial="hidden"
                        animate="show"
                        variants={stagger(0.09, 0.1)}
                    >
                        <motion.h1 variants={fadeUp} className="text-5xl leading-none font-extrabold tracking-[-0.03em] sm:text-6xl">
                            {title}
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mt-4 mb-10 text-xl text-muted">
                            {subtitle}
                        </motion.p>
                        <motion.div variants={fadeUp}>
                            {children}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* הצד הצבעוני */}
            <section aria-hidden="true" className="mesh relative m-4 hidden flex-col justify-end overflow-hidden rounded-[2.25rem] p-14 lg:flex">
                {/* "אורות" שזזים לאט */}
                <motion.span
                    className="absolute top-1/4 left-1/4 size-80 rounded-full bg-white/30 blur-3xl"
                    animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />

                {FLOATING.map((card, i) => (
                    <motion.div
                        key={card.title}
                        className={`glass absolute w-64 rounded-[1.4rem] px-5 py-4 shadow-float ${card.className}`}
                        initial={{ opacity: 0, y: 40, rotate: 0, scale: 0.9 }}
                        animate={{ opacity: 1, y: [0, -10, 0], rotate: card.rotate, scale: 1 }}
                        transition={{
                            opacity: { delay: card.delay, duration: 0.6 },
                            scale: { delay: card.delay, type: "spring", stiffness: 180, damping: 16 },
                            rotate: { delay: card.delay, type: "spring", stiffness: 180, damping: 16 },
                            y: { delay: card.delay + 0.6 + i * 0.4, duration: 6, repeat: Infinity, ease: "easeInOut" },
                        }}
                    >
                        <p className="flex items-center gap-1.5 text-[0.8rem] text-muted">
                            <span className={`size-2 rounded-full ${card.dot}`} /> {card.top}
                        </p>
                        <p className="mt-1 text-[1.1rem] font-bold">{card.title}</p>
                        {card.sub && <p className="text-sm text-ink-2">{card.sub}</p>}
                    </motion.div>
                ))}

                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-6xl leading-[1.02] font-extrabold tracking-[-0.03em] xl:text-7xl">
                        כל השמחות.
                        <br />
                        במקום אחד.
                    </p>
                    <p className="mt-5 max-w-md text-xl leading-relaxed text-ink-2">
                        חתונות, בריתות וקידושים של המשפחה והחברות, בלוח עברי משותף, עם תזכורת ביום השמחה.
                    </p>
                </motion.div>
            </section>
        </div>
    );
}
