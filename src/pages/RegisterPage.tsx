
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { ApiError } from "../api/api";
import AuthShell from "../components/ui/AuthShell";

type RegisterFormData = {
    fullName: string;
    email: string;
    password: string;
};

export default function RegisterPage() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");


    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>();

    async function handleRegister(data: RegisterFormData) {
        setServerError("");


        try {
            await registerUser({
                fullName: data.fullName.trim(),
                email: data.email.trim(),
                password: data.password,
            });

            navigate("/");
        } catch (err) {
            if (err instanceof ApiError && err.details?.length) {
                let hasFieldError = false;

                for (const detail of err.details) {
                    if (
                        detail.field === "fullName" ||
                        detail.field === "email" ||
                        detail.field === "password"
                    ) {
                        setError(detail.field, {
                            type: "server",
                            message: detail.message,
                        });
                        hasFieldError = true;
                    }
                }

                if (!hasFieldError) {
                    setServerError(err.message);
                }
            } else {
                setServerError(
                    err instanceof Error
                        ? err.message
                        : "אירעה שגיאה בהרשמה"
                );
            }
        }
    }

    return (
        <AuthShell title="מצטרפות לחגיגה." subtitle="פותחים חשבון בדקה, ומתחילים לשתף שמחות.">
            <form onSubmit={handleSubmit(handleRegister)} noValidate className="flex flex-col gap-5">
                <div className="field">
                    <label htmlFor="fullName" className="label">שם מלא</label>
                    <input
                        id="fullName"
                        type="text"
                        className="input"
                        autoComplete="name"
                        {...register("fullName", {
                            required: "יש להזין שם מלא",
                            validate: (value) =>
                                value.trim().length > 0 ||
                                "יש להזין שם מלא",
                            minLength: {
                                value: 2,
                                message: "השם חייב להכיל לפחות 2 תווים",
                            },
                            maxLength: {
                                value: 60,
                                message: "השם יכול להכיל עד 60 תווים",
                            },
                        })}
                    />
                    {errors.fullName && (
                        <p role="alert" className="field-error">{errors.fullName.message}</p>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="email" className="label">כתובת מייל</label>
                    <input
                        id="email"
                        type="email"
                        className="input"
                        dir="ltr"
                        placeholder="name@example.com"
                        autoComplete="email"
                        {...register("email", {
                            required: "יש להזין כתובת מייל",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "יש להזין כתובת מייל תקינה",
                            },
                        })}
                    />
                    {errors.email && (
                        <p role="alert" className="field-error">{errors.email.message}</p>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="password" className="label">סיסמה</label>
                    <input
                        id="password"
                        type="password"
                        className="input"
                        dir="ltr"
                        autoComplete="new-password"
                        {...register("password", {
                            required: "יש להזין סיסמה",
                            minLength: {
                                value: 8,
                                message: "הסיסמה חייבת להכיל לפחות 8 תווים",
                            },
                            maxLength: {
                                value: 72,
                                message: "הסיסמה יכולה להכיל עד 72 תווים",
                            },
                            validate: (value) =>
                                (/[A-Za-z]/.test(value) &&
                                    /\d/.test(value)) ||
                                "הסיסמה חייבת להכיל לפחות אות באנגלית אחת וספרה אחת",
                        })}
                    />
                    {errors.password ? (
                        <p role="alert" className="field-error">{errors.password.message}</p>
                    ) : (
                        <p className="hint">לפחות 8 תווים, עם אות באנגלית וספרה</p>
                    )}
                </div>

                {serverError && <p role="alert" className="form-alert">{serverError}</p>}

                <button type="submit" className="btn btn-primary btn-lg mt-1 w-full" disabled={isSubmitting}>
                    {isSubmitting ? "נרשמת..." : "יצירת חשבון"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                כבר יש לך חשבון? <Link to="/login" className="font-semibold">להתחברות</Link>
            </p>
        </AuthShell>
    );
}
