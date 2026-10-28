
import { useState } from "react";
import { useNavigate,Link ,useSearchParams} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";


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
        <div>
            <h1>התחברות</h1>

            <form onSubmit={handleSubmit(handleLogin)}>
                {sessionExpired && (
                    <p role="alert">
                        פג תוקף ההתחברות שלך. אנא התחברי מחדש.
                    </p>
                )}
                <div>
                    <label htmlFor="email">כתובת מייל</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", {
                            required: "יש להזין כתובת מייל",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "יש להזין כתובת מייל תקינה",
                            },
                        })}
                    />
                    {errors.email && (
                        <p role="alert">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password">סיסמה</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password", {
                            required: "יש להזין סיסמה",
                        })}
                    />
                    {errors.password && (
                        <p role="alert">{errors.password.message}</p>
                    )}
                </div>

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={isSubmitting }>
                    {isSubmitting  ? "מתחברת..." : "התחברות"}
                </button>
            </form>
            <p>
                עדיין אין לך חשבון? <Link to="/register">להרשמה</Link>
            </p>
        </div>
    );
}
