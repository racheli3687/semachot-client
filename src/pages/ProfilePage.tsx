import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useUpdateProfile } from "../hooks/useProfile";
import { ApiError } from "../api/api";
import Loading from "../components/Loading";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../utils/motion";
import { initials } from "../utils/celebrationVisuals";
import Icon from "../components/ui/Icon";

type ProfileFormValues = {
    fullName: string;
    emailReminders: boolean;
};

export default function ProfilePage() {
    const { user } = useAuth();
    const updateProfile = useUpdateProfile();
    const [saved, setSaved] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ProfileFormValues>({
        defaultValues: {
            fullName: user?.fullName ?? "",
            emailReminders: user?.emailReminders ?? true,
        },
    });

    // ProtectedRoute מבטיח שיש משתמשת, אבל TypeScript לא יודע את זה
    if (!user) {
        return <Loading />;
    }

    async function onSubmit(values: ProfileFormValues) {
        setSaved(false);

        try {
            const updated = await updateProfile.mutateAsync({
                fullName: values.fullName.trim(),
                emailReminders: values.emailReminders,
            });

            // הערכים השמורים הופכים ל"נקודת ההתחלה" החדשה של הטופס
            reset({
                fullName: updated.fullName,
                emailReminders: updated.emailReminders,
            });
            setSaved(true);
        } catch (err) {
            const nameError = err instanceof ApiError
                ? err.details?.find((d) => d.field === "fullName")
                : undefined;

            if (nameError) {
                setError("fullName", { type: "server", message: nameError.message });
            } else {
                setError("root", {
                    type: "server",
                    message: err instanceof Error ? err.message : "אירעה שגיאה בשמירה",
                });
            }
        }
    }

    return (
        <motion.section initial="hidden" animate="show" variants={stagger(0.08)} className="mx-auto flex max-w-3xl flex-col gap-5">
            {/* כרטיס עם השם */}
            <motion.header variants={fadeUp} className="mesh relative flex flex-wrap items-end gap-6 overflow-hidden rounded-[2rem] p-7 sm:p-10">
                <motion.span
                    className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-[#ff9f6b] via-[#ff6fa8] to-[#4fb6ff] p-[3px] shadow-float sm:size-24"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 13 }}
                    aria-hidden="true"
                >
                    <span className="grid size-full place-items-center rounded-full bg-white text-3xl font-extrabold text-[#1d1d1f] sm:text-4xl">
                        {initials(user.fullName)}
                    </span>
                </motion.span>
                <div>
                    <p className="eyebrow">הפרופיל שלי</p>
                    <h1 className="mt-1 text-4xl leading-none font-extrabold tracking-[-0.03em] sm:text-5xl">{user.fullName}</h1>
                </div>
            </motion.header>

            {/* פרטים - רשימה בסגנון ההגדרות של אייפון */}
            <motion.dl variants={fadeUp} className="list">
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                    <dt className="flex items-center gap-2 text-muted"><Icon name="user" className="size-4" /> כתובת מייל</dt>
                    <dd dir="ltr" className="truncate font-medium">{user.email}</dd>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-4">
                    <dt className="flex items-center gap-2 text-muted"><Icon name="calendar" className="size-4" /> חברה מאז</dt>
                    <dd className="font-medium">{new Date(user.createdAt).toLocaleDateString("he-IL")}</dd>
                </div>
            </motion.dl>

            <motion.form variants={fadeUp} onSubmit={handleSubmit(onSubmit)} noValidate className="panel flex flex-col gap-5">
                <h2 className="card-title">עריכת פרטים</h2>
                <div className="field">
                    <label htmlFor="fullName" className="label">שם מלא</label>
                    <input
                        id="fullName"
                        className="input"
                        autoComplete="name"
                        {...register("fullName", {
                            required: "יש להזין שם מלא",
                            validate: (value) => {
                                const length = value.trim().length;
                                return (length >= 2 && length <= 60) || "בין 2 ל־60 תווים";
                            },
                        })}
                    />
                    {errors.fullName && <p role="alert" className="field-error">{errors.fullName.message}</p>}
                </div>

                <div>
                    {/* מתג "פועל / כבוי" בסגנון אייפון - בפועל זה checkbox רגיל */}
                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-surface-2 p-4">
                        <span className="flex items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-[0.6rem] bg-sys-red text-white"><Icon name="bell" className="size-5" /></span>
                            <span>
                                <span className="block font-medium">לקבל תזכורת במייל ביום השמחה</span>
                                <span className="hint">מייל קצר בבוקר של כל שמחה בקבוצות שלך</span>
                            </span>
                        </span>
                        <span className="relative inline-flex shrink-0">
                            <input type="checkbox" className="peer sr-only" {...register("emailReminders")} />
                            <span className="h-[31px] w-[51px] rounded-full bg-[#e9e9ea] transition-colors peer-checked:bg-sys-green peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 dark:bg-[#39393d]" />
                            <span className="absolute top-[2px] right-[2px] size-[27px] rounded-full bg-white shadow-[0_3px_8px_rgb(0_0_0/0.15)] transition-transform duration-300 peer-checked:-translate-x-5" />
                        </span>
                    </label>
                </div>

                {errors.root && <p role="alert" className="form-alert">{errors.root.message}</p>}
                {saved && !isDirty && (
                    <motion.p
                        role="status"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm font-medium text-sys-green"
                    >
                        <Icon name="check" className="size-4" /> הפרטים נשמרו
                    </motion.p>
                )}

                <button type="submit" className="btn btn-primary btn-lg self-start" disabled={!isDirty || isSubmitting}>
                    {isSubmitting ? "שומרת..." : "שמירה"}
                </button>
            </motion.form>
        </motion.section>
    );
}
