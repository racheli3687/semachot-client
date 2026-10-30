import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCelebrationQuery, useRemoveCelebrationFromGroup } from "../hooks/useCelebrations";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import CelebrationOwnerActions from "../components/celebrations/CelebrationOwnerActions";
import CelebrationImageEditor from "../components/celebrations/CelebrationImageEditor";
import { ApiError } from "../api/api";
import { formatGregorianDate } from "../utils/dates";
import { motion } from "motion/react";
import { MONTH_NAMES, TYPE_BG, initials } from "../utils/celebrationVisuals";
import { countdownText, daysBetween } from "../utils/countdown";
import { useHebrewTodayQuery } from "../hooks/useHebrewCalendar";
import { HEBREW_DAY_LETTERS } from "../utils/hebrewCalendar";
import Icon from "../components/ui/Icon";
import { fadeUp, stagger } from "../utils/motion";

type LocationState = { imageFailed?: boolean } | null;

export default function CelebrationDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const celebrationId = Number(id);

    const navigate = useNavigate();
    const location = useLocation();
    const imageFailed = (location.state as LocationState)?.imageFailed === true;

    const celebrationQuery = useCelebrationQuery(celebrationId);
    // לתצוגת "בעוד X ימים" בלבד
    const { data: today } = useHebrewTodayQuery();
    const removeFromGroup = useRemoveCelebrationFromGroup();

    // חזרה: אם הגיעו מתוך האתר - אחורה (שומר על הסינון בלוח). אם נכנסו ישר מקישור - ללוח.
    function goBack() {
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate("/");
        }
    }

    const notFound = (
        <section className="state-box">
            <Icon name="search" className="size-10 text-accent" />
            <p>השמחה לא נמצאה</p>
            <Link to="/" className="btn btn-secondary">חזרה ללוח</Link>
        </section>
    );

    // 1. מזהה לא תקין בכתובת
    if (!Number.isInteger(celebrationId) || celebrationId <= 0) {
        return notFound;
    }

    // 2. שגיאה (404 = לא קיימת, או שאין לי גישה אליה)
    if (celebrationQuery.isError) {
        const error = celebrationQuery.error;
        if (error instanceof ApiError && error.status === 404) {
            return notFound;
        }
        return <ErrorMessage error={error} />;
    }

    // 3. טעינה
    const celebration = celebrationQuery.data;
    if (!celebration) {
        return <Loading message="טוען את פרטי השמחה..." />;
    }

    const { permissions } = celebration;

    async function handleRemoveFromGroup(groupId: number, groupName: string) {
        const confirmed = window.confirm(
            `להסיר את השמחה מהקבוצה "${groupName}"? השמחה עצמה לא תימחק.`
        );
        if (!confirmed) return;

        try {
            await removeFromGroup.mutateAsync({ groupId, celebrationId });

            // מי שאינה בעלת השמחה כנראה כבר לא רואה אותה - חוזרים לדף הקבוצה
            if (!permissions.canEdit) {
                navigate(`/groups/${groupId}`, { replace: true });
            }
        } catch {
            // השגיאה מוצגת למטה
        }
    }

    const days = today ? daysBetween(today.date, celebration.date) : null;

    return (
        <motion.article
            initial="hidden"
            animate="show"
            variants={stagger(0.07)}
            className="mx-auto flex max-w-5xl flex-col gap-4"
        >
            <motion.div variants={fadeUp}>
                <button type="button" onClick={goBack} className="btn btn-ghost -ms-3 px-3"><Icon name="chevronRight" /> חזרה</button>
            </motion.div>

            {imageFailed && !celebration.imageUrl && (
                <p role="alert" className="form-alert">
                    השמחה נשמרה, אבל התמונה לא הועלתה. אפשר להעלות אותה כאן למטה.
                </p>
            )}

            {/* הכרטיס הראשי */}
            <motion.div
                variants={fadeUp}
                className="mesh relative flex min-h-[22rem] flex-col justify-between gap-8 overflow-hidden rounded-[2rem] p-7 sm:p-11"
            >
                {celebration.imageUrl && (
                    <>
                        <img src={celebration.imageUrl} alt={celebration.title} className="absolute inset-0 size-full object-cover" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />
                    </>
                )}

                <div className="relative flex flex-wrap items-center gap-2">
                    <span className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink">
                        <span className={`size-2 rounded-full ${TYPE_BG[celebration.type]}`} aria-hidden="true" />
                        {celebration.typeLabel}
                    </span>
                    {celebration.isToday ? (
                        <p className="rounded-full bg-[#1d1d1f] px-3.5 py-1.5 text-sm font-semibold text-white"><strong>השמחה היום!</strong></p>
                    ) : (
                        days !== null && <span className="glass rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink">{countdownText(days)}</span>
                    )}
                </div>

                {/* "דף לוח שנה" בסגנון האייקון של Apple */}
                <motion.div
                    className="absolute top-7 left-7 w-24 overflow-hidden rounded-[1.4rem] bg-white text-center shadow-float sm:top-11 sm:left-11 sm:w-32"
                    initial={{ rotate: -12, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: -4, scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.25 }}
                    aria-hidden="true"
                >
                    <span className="block bg-sys-red py-1.5 text-sm font-semibold text-white">{MONTH_NAMES[celebration.hebrewDate.month]}</span>
                    <span className="block pt-2 text-5xl leading-none font-extrabold text-[#1d1d1f] sm:text-6xl">{HEBREW_DAY_LETTERS[celebration.hebrewDate.day - 1]}</span>
                    <span className="block pt-1 pb-2.5 text-xs text-[#6e6e73]">{formatGregorianDate(celebration.date)}</span>
                </motion.div>

                <div className="relative">
                    <h1 className={`text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.03em] sm:text-7xl ${celebration.imageUrl ? "text-white" : ""}`}>{celebration.title}</h1>
                    <p className={`mt-4 flex items-center gap-2 text-[1.05rem] ${celebration.imageUrl ? "text-white/85" : "text-ink-2"}`}>
                        <span className="grid size-7 place-items-center rounded-full bg-white text-xs font-bold text-[#1d1d1f]" aria-hidden="true">
                            {initials(celebration.owner.fullName)}
                        </span>
                        שותף על ידי {celebration.owner.fullName}
                    </p>
                </div>
            </motion.div>

            <motion.dl variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="card flex flex-col gap-1.5 p-5">
                    <dt className="flex items-center gap-1.5 text-sm text-muted"><Icon name="calendar" className="size-4" /> תאריך</dt>
                    <dd className="text-[1.15rem] leading-snug font-bold">
                        {celebration.hebrewDate.text} ({formatGregorianDate(celebration.date)})
                    </dd>
                </div>

                <div className="card flex flex-col gap-1.5 p-5">
                    <dt className="flex items-center gap-1.5 text-sm text-muted"><Icon name="clock" className="size-4" /> שעה</dt>
                    <dd className="text-[1.6rem] leading-tight font-bold">{celebration.time}</dd>
                </div>

                <div className={`card flex flex-col gap-1.5 p-5 ${celebration.address ? "" : "col-span-2"}`}>
                    <dt className="flex items-center gap-1.5 text-sm text-muted"><Icon name="pin" className="size-4" /> מקום</dt>
                    <dd className="text-[1.15rem] leading-snug font-bold">{celebration.venueName}</dd>
                </div>

                {celebration.address && (
                    <div className="card flex flex-col gap-1.5 p-5">
                        <dt className="flex items-center gap-1.5 text-sm text-muted"><Icon name="home" className="size-4" /> כתובת</dt>
                        <dd className="text-[1.15rem] leading-snug font-bold">{celebration.address}</dd>
                    </div>
                )}
            </motion.dl>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <motion.section variants={fadeUp} className="panel flex flex-col gap-4" aria-label="פרטים">
                    <h2 className="card-title">פרטים</h2>
                    {celebration.description ? (
                        <p className="text-[1.1rem] leading-relaxed whitespace-pre-line text-ink-2">{celebration.description}</p>
                    ) : (
                        <p className="hint">אין פרטים נוספים.</p>
                    )}
                </motion.section>

                <motion.section variants={fadeUp} aria-label="קבוצות" className="panel">
                    <h2 className="card-title mb-2">משותפת בקבוצות</h2>

                    {celebration.groups.length === 0 ? (
                        <p className="hint">השמחה לא משותפת כרגע באף קבוצה שלך.</p>
                    ) : (
                        <ul>
                            {celebration.groups.map((group) => (
                                <li key={group.id} className="flex items-center justify-between gap-2 border-line py-3 [&+&]:border-t">
                                    <Link to={`/groups/${group.id}`} className="flex items-center gap-2 text-[1.05rem] font-medium text-ink">
                                        <Icon name="users" className="size-4 text-muted" /> {group.name}
                                    </Link>

                                    {permissions.canRemoveFromGroupIds.includes(group.id) && (
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            disabled={removeFromGroup.isPending}
                                            onClick={() => handleRemoveFromGroup(group.id, group.name)}
                                        >
                                            {removeFromGroup.isPending &&
                                            removeFromGroup.variables?.groupId === group.id
                                                ? "מסירה..."
                                                : "הסרה מהקבוצה"}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    {removeFromGroup.isError && <div className="mt-3"><ErrorMessage error={removeFromGroup.error} /></div>}
                </motion.section>
            </div>

            {permissions.canEdit && (
                <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2">
                    <CelebrationOwnerActions
                        celebrationId={celebration.id}
                        title={celebration.title}
                    />
                    <CelebrationImageEditor celebration={celebration} />
                </motion.div>
            )}
        </motion.article>
    );
}
