
import { useState } from "react";
import { useNavigate,Link ,useSearchParams} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import AuthShell from "../components/ui/AuthShell";


type LoginFormData = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();


    const {
        register,
        handleSubmit,
        formState: { errors,isSubmitting  },
    } = useForm<LoginFormData>();

    const [error, setError] = useState("");
    
    async function handleLogin(data: LoginFormData) {
        setError("");
        
        try {
            await login({
                email: data.email,
                password: data.password,
            });

            navigate("/");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "אירעה שגיאה בהתחברות"
            );
        } 
    }
    const [searchParams] = useSearchParams();

    const sessionExpired = searchParams.get("reason") === "session-expired";

    return (
        <AuthShell title="ברוכה השבה." subtitle="התחברי כדי לראות מה חוגגים השבוע.">
            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-5">
                {sessionExpired && (
                    <p role="alert" className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent">
                        פג תוקף ההתחברות שלך. אנא התחברי מחדש.
                    </p>
                )}
                <div className="field">
                    <label htmlFor="email" className="label">כתובת מייל</label>
                    <input
                        id="email"
                        type="email"
                        className="input"
                        placeholder="name@example.com"
                        dir="ltr"
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
                        {...register("password", {
                            required: "יש להזין סיסמה",
                        })}
                    />
                    {errors.password && (
                        <p role="alert" className="field-error">{errors.password.message}</p>
                    )}
                </div>

                {error && <p role="alert" className="form-alert">{error}</p>}

                <button type="submit" className="btn btn-primary btn-lg mt-1 w-full" disabled={isSubmitting }>
                    {isSubmitting  ? "מתחברת..." : "התחברות"}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-muted">
                עדיין אין לך חשבון? <Link to="/register" className="font-semibold">להרשמה</Link>
            </p>
        </AuthShell>
    );
}
