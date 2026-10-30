
import { Navigate, Outlet } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import Logo from "./ui/Logo";

export default function ProtectedRoute() {
    const { status } = useAuth();

    if (status === "loading") {
        return (
            <div className="grid min-h-dvh place-items-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex max-w-sm flex-col items-center gap-5 text-center"
                >
                    <motion.span
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Logo size="lg" withText={false} />
                    </motion.span>
                    <p className="text-2xl font-bold tracking-[-0.01em]">מכינים את הלוח...</p>
                    <p className="hint">
                        בכניסה הראשונה השרת עשוי להתעורר.
                        הפעולה יכולה להימשך עד דקה, נא להמתין.
                    </p>
                    <span className="h-1 w-40 overflow-hidden rounded-full bg-line" aria-hidden="true">
                        <motion.span
                            className="block h-full w-1/3 rounded-full bg-accent"
                            animate={{ x: ["120%", "-320%"] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </span>
                </motion.div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
