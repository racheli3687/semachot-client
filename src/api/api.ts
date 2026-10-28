import { getToken, removeToken } from "../utils/token";

import type {
    ApiErrorCode,
    ApiErrorDetail,
    ApiErrorResponse,
} from "../types/api";



export class ApiError extends Error {
    status: number;
    code: ApiErrorCode | undefined;
    details: ApiErrorDetail[] | undefined;

    constructor(
        message: string,
        status: number,
        code?: ApiErrorCode,
        details?: ApiErrorDetail[]
    ) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}


const API_BASE_URL = import.meta.env.VITE_API_URL;


export async function apiRequest<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers = new Headers(options.headers);

    if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    let response: Response;

    // שלב 1: שליחת הבקשה וטיפול בבעיות חיבור
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers,
        });
    } catch {
        throw new ApiError(
            "אין חיבור לשרת. נסי שוב בעוד רגע",
            0
        );
    }

    // שלב 2: טיפול בתגובה ללא תוכן
    if (response.status === 204) {
        return undefined as T;
    }

    // שלב 3: ניסיון לקרוא את התגובה כ-JSON
    let data: ApiErrorResponse | T | null = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    
    // שלב 4: טיפול בתשובת שגיאה מהשרת
    if (!response.ok) {
        const errorData = data as ApiErrorResponse | null;

        const message =
            errorData?.error?.message ??
            "ארעה שגיאה בביצוע הבקשה";

        // אם הטוקן נדחה על ידי השרת, נחזיר את המשתמשת להתחברות
        const isLoginRequest = path === "/api/auth/login";

        if (response.status === 401 && token && !isLoginRequest) {
            removeToken();
            window.location.assign("/login?reason=session-expired");
        }

        throw new ApiError(
            message,
            response.status,
            errorData?.error?.code,
            errorData?.error?.details
        );
    }

    // שלב 5: החזרת הנתונים למי שקראה לפונקציה
    if (data === null) {
        throw new ApiError(
            "התקבלה תגובה לא תקינה מהשרת",
            response.status
        );
    }

    return data as T;
}
