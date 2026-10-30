import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ui/ThemeToggle";
import Logo from "./ui/Logo";
import Icon, { type IconName } from "./ui/Icon";
import { initials } from "../utils/celebrationVisuals";

const NAV_ITEMS: { to: string; label: string; short: string; icon: IconName; end: boolean }[] = [
    { to: "/", label: "הלוח שלי", short: "הלוח", icon: "calendar", end: true },
    { to: "/groups", label: "הקבוצות שלי", short: "קבוצות", icon: "users", end: false },
    { to: "/profile", label: "הפרופיל שלי", short: "פרופיל", icon: "user", end: false },
];

function Layout() {


    const { user, status, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        logout();
        navigate("/login");
    }


    return (
        <div className="flex min-h-dvh flex-col">
            {/* ===== Header: "קפסולה" שקופה שצפה מעל הדף ===== */}
            <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
                <motion.div
                    initial={{ y: -24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    className="mx-auto flex max-w-6xl items-center gap-2 rounded-[1.4rem] border border-white/80 bg-[var(--glass)] p-2 shadow-float backdrop-blur-2xl backdrop-saturate-[1.8] sm:gap-3 dark:border-white/10"
                >
                    <NavLink to="/" className="ps-1 no-underline hover:no-underline" aria-label="לוח שמחות - לדף הבית">
                        <Logo />
                    </NavLink>

                    {/* תפריט - במחשב בתוך ה-header */}
                    <nav aria-label="תפריט ראשי" className="ms-4 hidden items-center gap-1 md:flex">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className="relative flex items-center gap-2 rounded-[0.9rem] px-4 py-2.5 text-[0.95rem] font-medium text-muted no-underline transition-colors hover:text-ink hover:no-underline [&.active]:text-accent"
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-pill"
                                                className="absolute inset-0 -z-10 rounded-[0.9rem] bg-accent-soft"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                        <Icon name={item.icon} className="size-[1.1rem]" />
                                        {item.label}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="ms-auto flex items-center gap-2">
                        <ThemeToggle />
                        <Link to="/celebrations/new" className="btn btn-primary hidden rounded-[0.9rem] px-4 sm:inline-flex">
                            <Icon name="plus" /> הוספת שמחה
                        </Link>
                        {status==="authenticated"&&user&&(
                            <>
                            {/* עיגול עם האות הראשונה, ומסגרת צבעונית */}
                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#ff9f6b] via-[#ff6fa8] to-[#4fb6ff] p-[2px]" title={`שלום, ${user.fullName}`}>
                                <span className="grid size-full place-items-center rounded-full bg-surface text-sm font-bold text-ink">
                                    <span aria-hidden="true">{initials(user.fullName)}</span>
                                    <span className="sr-only">שלום, {user.fullName}</span>
                                </span>
                            </span>
                            <button
                                type="button"
                                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink"
                                onClick={handleLogout}
                                aria-label="התנתקות"
                                title="התנתקות"
                            >
                                <Icon name="logout" className="size-[1.15rem]" />
                            </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </header>

            {/* ===== בטלפון: סרגל צף בתחתית המסך ===== */}
            <nav
                aria-label="תפריט ראשי"
                className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-[1.6rem] border border-white/80 bg-[var(--glass)] p-1.5 shadow-float backdrop-blur-2xl backdrop-saturate-[1.8] md:hidden dark:border-white/10"
            >
                {NAV_ITEMS.slice(0, 1).map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.end} className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[0.7rem] font-medium text-muted no-underline hover:no-underline [&.active]:text-accent">
                        <Icon name={item.icon} className="size-6" />
                        {item.short}
                    </NavLink>
                ))}
                <Link to="/celebrations/new" className="grid size-12 place-items-center rounded-full bg-accent text-white shadow-float hover:no-underline" aria-label="הוספת שמחה">
                    <Icon name="plus" className="size-6" strokeWidth={2.4} />
                </Link>
                {NAV_ITEMS.slice(1).map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.end} className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[0.7rem] font-medium text-muted no-underline hover:no-underline [&.active]:text-accent">
                        <Icon name={item.icon} className="size-6" />
                        {item.short}
                    </NavLink>
                ))}
            </nav>


            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-32 sm:px-6 sm:pt-12 md:pb-20">
                {/* מעבר עדין בין דפים */}
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Outlet />
                </motion.div>
            </main>

            <footer className="hidden border-t border-line py-8 text-center text-sm text-muted md:block">
                לוח שמחות · כל השמחות של המשפחה והחברות, במקום אחד
            </footer>
        </div>




    )
}
export default Layout
