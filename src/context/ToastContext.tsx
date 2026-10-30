import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ToastContext, type ToastType } from "./toastContextObject";
import Icon, { type IconName } from "../components/ui/Icon";

type Toast = { id: number; message: string; type: ToastType };

const ICONS: Record<ToastType, IconName> = { success: "check", error: "alert", info: "info" };

const STYLES: Record<ToastType, string> = {
    success: "bg-sys-green text-white",
    error: "bg-sys-red text-white",
    info: "bg-sys-blue text-white",
};

// הודעות קופצות בפינת המסך - במקום alert של הדפדפן
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const nextId = useRef(1);

    const dismiss = useCallback((id: number) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = "info") => {
            const id = nextId.current++;
            setToasts((list) => [...list, { id, message, type }]);
            window.setTimeout(() => dismiss(id), 4500);
        },
        [dismiss]
    );

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div
                aria-live="polite"
                className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6"
            >
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: 24, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            role={toast.type === "error" ? "alert" : "status"}
                            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-full bg-[#1d1d1f]/90 p-2 pe-2 text-white shadow-float backdrop-blur-xl dark:bg-white/90 dark:text-[#1d1d1f]"
                        >
                            <span
                                className={`grid size-9 shrink-0 place-items-center rounded-full ${STYLES[toast.type]}`}
                            >
                                <Icon name={ICONS[toast.type]} className="size-5" strokeWidth={2.5} />
                            </span>
                            <p className="flex-1 py-1 text-sm font-medium">{toast.message}</p>
                            <button
                                type="button"
                                onClick={() => dismiss(toast.id)}
                                className="grid size-8 cursor-pointer place-items-center rounded-full opacity-70 transition hover:bg-white/10 hover:opacity-100 dark:hover:bg-black/10"
                                aria-label="סגירת ההודעה"
                            >
                                <Icon name="x" className="size-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
