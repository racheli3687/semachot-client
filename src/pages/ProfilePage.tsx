import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useUpdateProfile } from "../hooks/useProfile";
import { ApiError } from "../api/api";
import Loading from "../components/Loading";

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
        <section>
            <h1>הפרופיל שלי</h1>

            <dl>
                <dt>כתובת מייל</dt>
                <dd>{user.email}</dd>

                <dt>חברה מאז</dt>
                <dd>{new Date(user.createdAt).toLocaleDateString("he-IL")}</dd>
            </dl>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                    <label htmlFor="fullName">שם מלא</label>
                    <input
                        id="fullName"
                        autoComplete="name"
                        {...register("fullName", {
                            required: "יש להזין שם מלא",
                            validate: (value) => {
                                const length = value.trim().length;
                                return (length >= 2 && length <= 60) || "בין 2 ל־60 תווים";
                            },
                        })}
                    />
                    {errors.fullName && <p role="alert">{errors.fullName.message}</p>}
                </div>

                <div>
                    <label>
                        <input type="checkbox" {...register("emailReminders")} />
                        לקבל תזכורת במייל ביום השמחה
                    </label>
                </div>

                {errors.root && <p role="alert">{errors.root.message}</p>}
                {saved && !isDirty && <p role="status">הפרטים נשמרו ✓</p>}

                <button type="submit" disabled={!isDirty || isSubmitting}>
                    {isSubmitting ? "שומרת..." : "שמירה"}
                </button>
            </form>
        </section>
    );
}